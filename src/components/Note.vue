<template>
    <div class="note-wrapper">
        <div class="note-header">
            <div class="title">本页笔记</div>
            <div class="more">
                <i class="iconfont icon-gengduo"></i>
                <i class="iconfont icon-shanchu2"></i>
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
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core';
import { nanoid } from 'nanoid'
import { copyObjToReactive, removeUrlQuery, parseReactiveToObj } from '@/utils/utils'
import CellCard from '@/components/CellCard'
export default {
    name: 'Note',
    components: {
        CellCard
    },
    setup() {
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
        return {
            noteInfo,
            saveNote,
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
        display: flex;
        justify-content: space-between;
        align-items: center;

        width: 100%;
        height: 56px;

        padding: 14px 16px;

        border-bottom: 1px solid var(--note-ext-line);

        box-sizing: border-box;

        .title {
            font-size: 22px;
            font-weight: bold;
        }
        .more {
            display: flex;
            align-items: center;

            font-size: 20px;

            .iconfont {
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
</style>