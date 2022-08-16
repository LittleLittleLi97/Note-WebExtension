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
            chrome.runtime.sendMessage({func: 'getNoteById', id: noteId.value}, (response)=>{
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

        color: var(--note-ext-font);

        width: 298px;
        height: 96px;

        padding: 10px;

        background-color: var(--note-ext-card);

        border-radius: 5px;
        border: 1px solid var(--note-ext-card-border);

        box-sizing: border-box;

        .web-icon {
            width: 76px;
            height: 76px;

            img {
                width: 100%;
                height: 100%;

                border-radius: 10px;
            }
        }
        .right-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            // justify-content: space-between;

            width: 187px;

            margin-left: 15px;

            .title {
                font-size: 20px;
                font-family: Segoe UI;
                font-weight: semibold;
                line-height: normal;


                // width: 100%;

                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .description {
                font-size: 14px;
                color: var(--note-ext-font2);
                font-family: Microsoft YaHei;
                font-weight: regular;
                line-height: normal;

                margin-top: 5px;


                display: -webkit-box;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
            }
        }
    }
</style>