<template>
    <a :href="noteInfo.url" target="_blank" :data-noteId="noteInfo.id">
        <div class="collect-card">
            <div class="web-icon"><img :src="noteInfo.url_icon" alt=""></div>
            <!-- <div class="web-icon"><img src="./images/edge_logo.jpg" alt=""></div> -->
            <div class="right-info">
                <div class="title">
                    <span class="show-title" v-show="showTitleState">{{ noteInfo.title }}</span>
                    <input 
                        type="text" 
                        class="title-input"
                        ref="renameInputBox" 
                        v-show="!showTitleState" 
                        v-model="newName" 
                        @keypress.enter="renameEnd"
                        @blur="cancelRename"
                    >
                </div>
                <div class="description">{{ noteInfo.content }}</div>
            </div>
        </div>
    </a>
</template>

<script>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from '@vue/runtime-core'
import { copyObjToReactive } from '@/utils/utils';
export default {
    // popup收藏卡片
    name: 'CollectCard',
    props: {
        noteId: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const noteId = computed(()=>props.noteId);
        const noteInfo = reactive({});
        onMounted(()=>{
            chrome.runtime.sendMessage({func: 'getById', type: 'note', id: noteId.value}, (response)=>{
                copyObjToReactive(noteInfo, response);
            });
        })
        function renameFunction() {
            const showTitleState = ref(true);
            const renameInputBox = ref(null);
            const newName = ref('');
            function renameEnd() {
                noteInfo.title = newName.value;
                showTitleState.value = true;
                chrome.runtime.sendMessage({func: 'save', type: 'note', data: noteInfo});
            }
            function cancelRename() {
                showTitleState.value = true;
                newName.value = '';
            }
            onMounted(()=>{
                PubSub.subscribe('renameNote', (msg, noteId)=>{
                    if (noteInfo.id === noteId) {
                        showTitleState.value = false;
                        nextTick(()=>{
                            renameInputBox.value.focus();
                        });
                    }
                })
            })
            onBeforeUnmount(()=>{
                PubSub.unsubscribe('renameNote');
            })
            return {
                showTitleState,
                renameInputBox,
                newName,
                renameEnd,
                cancelRename,
            }
        }
        return {
            noteInfo,
            ...renameFunction(),
        }
    }
}
</script>

<style scoped lang="less">
    .collect-card {
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        color: var(--note-ext-font);

        width: 298px;
        height: 96px;

        margin-top: 10px;
        padding: 10px;

        background-color: var(--note-ext-card);

        border-radius: 5px;

        box-sizing: border-box;

        transition: all 0.2s;

        @media (prefers-color-scheme: light) {
            box-shadow: 0px 0px 2px 0px #0000003F;
            &:hover {
                box-shadow: 0px 2px 8px 0px #00000033;
                .right-info {
                    .title {
                        text-decoration: underline;
                    }
                }
            }
        }

        @media (prefers-color-scheme: dark) {
            box-shadow: 0px 0px 2px 0px #0000003F;
            &:hover {
                box-shadow: 0px 4px 8px 0px #0000003F;
            }
        }

        .web-icon {
            width: 64px;
            height: 64px;
            user-select: none;

            img {
                width: 100%;
                height: 100%;

                border-radius: 10px;
            }
        }
        .right-info {
            display: flex;
            flex-direction: column;

            width: 185px;

            margin-left: 15px;

            .title {
                font-size: 20px;
                font-family: Segoe UI;
                font-weight: semibold;
                line-height: normal;

                height: 28px;

                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                user-select: none;

                .title-input {
                    font-size: inherit;
                    color: inherit;

                    width: 180px;

                    background-color: transparent;

                    border-radius: 1px;
                    border: 2px solid var(--note-ext-popup-title-focus);
                    outline: none;

                    box-sizing: border-box;
                }
            }
            .description {
                font-size: 14px;
                color: var(--note-ext-font2);
                font-family: Microsoft YaHei;
                font-weight: regular;
                line-height: normal;

                height: 40px;
                margin-top: 5px;

                user-select: none;

                display: -webkit-box;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
            }
        }
    }
</style>