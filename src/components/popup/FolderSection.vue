<template>
    <div class="folder-section">
        <div 
            class="title" 
            @click="changeFolderState" 
            :data-collectId="collectInfo.id"
        >
            <i class="iconfont icon-tri-right-bottom-copy icon-default" :class="{'icon-rotate': !folderState.collectCardShow}"></i>
            <span class="show-title" v-show="showTitleState">{{ collectInfo.name }}</span>
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
        <div class="card-area" v-show="folderState.collectCardShow">
            <CollectCard 
                v-for="(item, index) in collectInfo.children" 
                :key="item" 
                :noteId="item"
            />
        </div>
    </div>
</template>

<script>
import CollectCard from '@/components/popup/CollectCard'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from '@vue/runtime-core'
import PubSub from 'pubsub-js';
export default {
    // popup折叠收藏夹
    name: 'FolderSection',
    props: {
        collectInfo: {
            type: Object,
            default: {}
        }
    },
    components: {
        CollectCard,
    },
    setup(props) {
        const collectInfo = computed(()=>props.collectInfo);
        const folderState = reactive({
            collectCardShow: false,
            iconfontClass: 'icon-tri-right'
        });
        function changeFolderState() { // 收藏夹更改折叠状态
            folderState.iconfontClass = folderState.collectCardShow ? 'icon-tri-right' : 'icon-tri-right-bottom-copy';
            folderState.collectCardShow = !folderState.collectCardShow;
        }
        function renameFunction() {
            const showTitleState = ref(true);
            const renameInputBox = ref(null);
            const newName = ref('');
            function renameEnd() {
                showTitleState.value = true;
                console.log('renameEnd', newName.value)
                PubSub.publish('renameCollectFinish', newName.value);
            }
            function cancelRename() {
                showTitleState.value = true;
                newName.value = '';
                PubSub.publish('cancelRenameCollect');
            }
            onMounted(()=>{
                PubSub.subscribe('renameCollect', (msg, collectId)=>{
                    if (collectInfo.value.id === collectId) {
                        showTitleState.value = false;
                        nextTick(()=>{
                            renameInputBox.value.focus();
                        });
                    }
                })
            })
            onBeforeUnmount(()=>{
                PubSub.unsubscribe('renameCollect');
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
            collectInfo,
            folderState,
            changeFolderState,
            ...renameFunction(),
        }
    }
}
</script>

<style scoped lang="less">
    .folder-section {
        color: var(--note-ext-font);

        .title {
            font-size: 16px;
            font-family: Segoe UI;
            font-weight: regular;
            line-height: normal;
            letter-spacing: 0px;
            text-align: left;

            padding: 5px 12px;

            height: 32px;
            
            border-radius: 1px;

            box-sizing: border-box;

            cursor: pointer;

            transition: background-color 0.2s;

            &:hover {
                background-color: var(--note-ext-popup-title-hover);
            }

            .iconfont {
                margin-right: 5px;
            }

            .title-input {
                font-size: 15px;
                color: inherit;

                width: 270px;

                background-color: transparent;

                border-radius: 1px;
                border: 2px solid var(--note-ext-popup-title-focus);
                outline: none;

                box-sizing: border-box;
            }
            .show-title {
                user-select: none;
            }
            .icon-rotate {        
                transform: rotate(-45deg);
            }
            .icon-default {
                display: inline-block;
                transition: all .5s;
            }
        }

        .card-area {
            display: grid;
            // grid-gap: 10px;

            // margin-top: 10px;
            padding: 0 11px;

            box-sizing: border-box;
        }
    }
</style>