<template>
    <transition>
        <div class="note-wrapper">
            <div class="note-header">
                <div class="header-top">
                    <div class="title">本页笔记</div>
                    <div class="more">
                        <i class="iconfont icon-gengduo"></i>
                        <i class="iconfont icon-shanchu2" @click="closeNoteEvent"></i>
                    </div>
                </div>
                <div class="classification-area">
                    <i class="iconfont icon-shoucang"></i>
                    <div class="classification">{{ noteInfo.collect }}</div>
                </div>
            </div>
            <div class="cell-area">
                <CellCard 
                    v-for="(item, index) in noteInfo.children" 
                    :key="item"
                    :cellId="item"
                    class="cell-card"
                    @saveNote="saveNote"
                />
            </div>
        </div>
    </transition>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core';
import { nanoid } from 'nanoid'
import { copyObjToReactive, removeUrlQuery, parseReactiveToObj } from '@/utils/utils'
import CellCard from '@/components/CellCard'
export default {
    name: 'Note',
    emits: ['closeNote'],
    components: {
        CellCard
    },
    setup(props, context) {
        const noteInfo = reactive({
            id: null,
            url: '',
            url_icon: '',
            title: '',
            content: '',
            collect: '',
            children: [],
        });
        const isNewNote = ref(false);
        // 存储
        function saveNote({ newContent }) {
            noteInfo.content = newContent;
            chrome.runtime.sendMessage({
                func: 'save',
                type: 'note',
                data: parseReactiveToObj(noteInfo)
            });
            if (isNewNote.value) {
                isNewNote.value = false;
                chrome.runtime.sendMessage({
                    func: 'addCollectChildren',
                    data: {
                        collect: noteInfo.collect,
                        id: noteInfo.id
                    }
                });
            }
        }
        // 初始化信息
        onMounted(()=>{
            noteInfo.url_icon = document.querySelector("link[rel='shortcut icon']").href;
            noteInfo.url = removeUrlQuery(window.location.href);

            chrome.runtime.sendMessage({func: 'getNoteByUrl', url: noteInfo.url}, (response)=>{
                if (response) {
                    copyObjToReactive(noteInfo, response);
                } else {
                    isNewNote.value = true;
                    noteInfo.id = nanoid();
                    noteInfo.children.push(nanoid());
                    noteInfo.title = document.getElementsByTagName('title')[0].innerText;
                    noteInfo.collect = '默认收藏夹';
                }
            });
        })

        // 关闭Note
        function closeNoteEvent() {
            context.emit('closeNote');
        }
        return {
            noteInfo,
            saveNote,
            closeNoteEvent,
        }
    }
}
</script>

<style scoped lang="less">
.note-wrapper {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 9999;

    display: flex;
    flex-direction: column;

    color: var(--note-ext-font);

    width: 400px;
    height: 100%;
    background-color: var(--note-ext-theme2);

    border: 1px solid var(--note-ext-border);

    box-sizing: border-box;

    .note-header {
        padding: 14px 16px;

        border-bottom: 1px solid var(--note-ext-line);

        box-sizing: border-box;

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            width: 100%;
            height: 56px;

            margin-left: 5px; // 下面收藏夹hover动画的padding的5px，这里设置让文字对齐。

            .title {
                font-size: 22px;
                font-weight: bold;
            }
            .more {
                display: flex;
                align-items: center;
    
                .iconfont {
                    font-size: 22px;
                    text-align: center;
                    line-height: 30px;

                    width: 30px;
                    height: 30px;
    
                    margin-left: 12px;

                    border-radius: 5px;

                    transition: background-color 0.2s;

                    cursor: pointer;

                    &:hover {
                        background-color: var(--note-ext-icon-hover);
                    }
                }
            }
        }
        .classification-area {
            display: inline-flex; // 宽度自适应，不占整行
            justify-content: center;
            align-items: center;

            padding: 2px 5px;

            border-radius: 5px;

            box-sizing: border-box;

            transition: background-color 0.2s;

            cursor: pointer;

            &:hover {
                background-color: var(--note-ext-icon-hover);
            }

            .iconfont {
                font-size: 20px;
            }
            .classification {
                font-size: 16px;
                color: var(--note-ext-font);
                font-family: Segoe UI;
                font-weight: Semilight;
                line-height: normal;
                letter-spacing: 0px;
                text-align: left;

                margin-left: 10px;
            }
        }
    }
    .cell-area {
        flex: 1;

        padding: 10px 20px;

        overflow-y: scroll;
        scroll-behavior: contain;

        .cell-card {
            margin-top: 10px;
        }
    }
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>