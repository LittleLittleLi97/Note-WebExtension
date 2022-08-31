<template>
    <div class="pop-content" @contextmenu="openContextMenu" @click="closeContextMenu">
        <div class="header">
            <div class="title">MyNote</div>
            <div class="icons">
                <i class="iconfont icon-folder-add" @click="createItem" @mouseenter="showTooltip" @mouseleave="hideTooltip"></i>
                <i class="iconfont icon-gengduo"></i>
                <Tooltip></Tooltip>
            </div>  
        </div>
        <div class="body">
            <FolderSection 
                v-for="(item, index) in collectList" 
                :key="item.id" 
                :collectInfo="item" 
            />
        </div>
    </div>
    <div class="collect-manager" v-show="collectManagerShow" ref="collectManagerDiv">
        <CollectManager 
            :type="collectManagerType"
            @closeContextMenu="closeContextMenu"
            @deleteItem="deleteItem"
            @renameItem="renameItem"
            @createItem="createItem"
            @exportNode="exportNode"
        ></CollectManager>
    </div>
    <CreateCollectPopover></CreateCollectPopover>
</template>

<script>
import { computed, nextTick, onMounted, reactive, ref } from '@vue/runtime-core'
import FolderSection from '@/components/popup/FolderSection'
import CollectManager from '@/components/popup/CollectManager'
import CreateCollectPopover from '@/components/popup/CreateCollectPopover'
import PubSub from 'pubsub-js'
import { nanoid } from 'nanoid'
import { deleteCollect, deleteNote } from '@/utils/dbRequest'
import { downloadNote } from '@/utils/utils'
import Tooltip from '../others/Tooltip.vue'
export default {
    name: 'Collect',
    components: {
        FolderSection,
        CollectManager,
        CreateCollectPopover,
        Tooltip
    },
    // props: {
    //     tooltipShow,
    //     tooltipText
    // },
    setup() {
        // 初始化数据
        const collectList = reactive({});
        onMounted(()=>{
            chrome.runtime.sendMessage({func: 'getCollect'}, (response)=>{
                for (let key in response) collectList[response[key].id] = response[key];
            });
        })

        // 右键管理
        function collectManagerFunction() {
            const collectManagerShow = ref(false);
            const collectManagerDiv = ref(null);
            const collectManagerType = ref('local');
            let noteId = null; // 用于记录这是对note的操作还是collect的操作，应该保持只有一个不为null
            let collectId = null;
            function openContextMenu(event) {
                const path = event.path;
                let flag = false;

                event.preventDefault();
                collectManagerDiv.value.style.cssText = `top: ${event.pageY}px; left: ${event.pageX}px;`;
                collectManagerShow.value = true;

                path.forEach((item)=>{
                    try {
                        let tempNoteId = item.getAttribute('data-noteId');
                        let tempCollectId = item.getAttribute('data-collectId');
                        if (tempNoteId || tempCollectId) {
                            // if (tempNoteId) 
                            noteId = tempNoteId;
                            // if (tempCollectId) 
                            collectId = tempCollectId;
                            flag = true;
                        }
                    } catch (error) {
                    }
                });
                if (noteId) collectManagerType.value = 'note';
                else if (collectId) collectManagerType.value = 'folder';
                else collectManagerType.value = 'global';
            }
            function closeContextMenu() {
                collectManagerShow.value = false;
                noteId = null;
                collectId = null;
            }
            function deleteItem() {
                if (collectId) {
                    // chrome.runtime.sendMessage({func: 'delete', type: 'collect', id: collectId});
                    // let children = collectList[collectId].children;
                    // children.forEach((item)=>{
                    //     chrome.runtime.sendMessage({func: 'delete', type: 'note', id: item});
                    // });
                    deleteCollect(collectId);
                    delete collectList[collectId];
                }
                if (noteId) {
                    let id = noteId; // 异步的原因，response的回调中noteId已被改为null, 需要保存下来
                    chrome.runtime.sendMessage({func: 'getById', type: 'note', id}, (response)=>{
                        // 找到collect的id
                        let collect = collectList[response.collect_id]
                        let children = collect.children;
                        let index = children.indexOf(id);
                        if (index !== -1) children.splice(index, 1);
                        chrome.runtime.sendMessage({func: 'save', type: 'collect', data: collect});
                        deleteNote(id);
                    })
                }
                collectId = null;
                noteId = null;
            }
            function renameItem() {
                if (collectId) {
                    _renameCollect(collectId);
                }
                if (noteId) {
                    let id = noteId;
                    PubSub.publish('renameNote', id);
                }
            }
            function createItem() {
                let id = nanoid();
                collectList[id] = {
                    id,
                    name: '新建文件夹',
                    createTime: Date.now(),
                    children: []
                };
                chrome.runtime.sendMessage({func: 'save', type: 'collect', data: collectList[id]});
                _renameCollect(id);
            }
            function exportNode(type) {
                downloadNote(type, {noteId});
            }
            onMounted(()=>{
                // 创建新的收藏夹
                // CreateCollectPopover.vue的订阅
                // PubSub.subscribe('createCollectEnd', (msg, name)=>{
                //     let id = nanoid();
                //     collectList[id] = {id, name, children: []};
                //     chrome.runtime.sendMessage({func: 'save', type: 'collect', data: collectList[id]});
                // })
            })
            function _renameCollect(id) {
                PubSub.publish('renameCollect', id);
                PubSub.subscribe('renameCollectFinish', (msg, newName)=>{
                    console.log('renameCollectFinish', newName)
                    collectList[id].name = newName;
                    chrome.runtime.sendMessage({func: 'save', type: 'collect', data: collectList[id]});
                    let children = collectList[id].children;
                    children.forEach((item)=>{ // 更新note中的collect_name
                        chrome.runtime.sendMessage({func: 'getById', type: 'note', id: item}, (response)=>{
                            response.collect = newName;
                            chrome.runtime.sendMessage({func: 'save', type: 'note', data: response});
                        });
                    });
                    PubSub.unsubscribe('renameCollectFinish');
                });
                PubSub.subscribe('cancelRenameCollect', ()=>{
                    // 取消重命名后一定要去掉上次的订阅，不然在下一次重命名时，上次的订阅也会响应，造成多个Collect被重命名
                    PubSub.unsubscribe('renameCollectFinish');
                    PubSub.unsubscribe('cancelRenameCollect');
                })
            }
            return {
                collectManagerShow,
                collectManagerDiv,
                collectManagerType,
                openContextMenu,
                closeContextMenu,
                deleteItem,
                renameItem,
                createItem,
                exportNode,
            }
        }
        return {
            collectList,
            ...collectManagerFunction(),
        }
    },
    methods: {
        showTooltip() {
            Tooltip.methods.enter("try");
            Tooltip.methods.move(this.event);
        },
        hideTooltip() {
            Tooltip.methods.leave();
        }
    }
}
</script>

<style scoped lang="less">
.pop-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    color: var(--note-ext-font);

    width: 330px;
    height: 520px;

    background-color: var(--note-ext-theme);

    box-sizing: border-box;
    box-shadow: 0px 16px 30px 0px #0000003F;

    overflow-y: scroll;
    scroll-behavior: contain;

    &::-webkit-scrollbar {
        display: none;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        width: 100%;
        
        padding: 12px 16px;

        border-bottom: 1px solid var(--note-ext-line);

        box-sizing: border-box;
        
        .title {
            font-size: 22px;
            font-family: Segoe UI;
            font-weight: bold;
            user-select: none;
        }
        .icons {
            position: relative;
            display: flex;
            align-items: center;
            .iconfont {
                font-size: 22px;
                text-align: center;
                line-height: 30px;

                width: 30px;
                height: 30px;

                margin-left: 8px;

                border-radius: 2px;

                cursor: pointer;

                transition: background-color 0.2s;

                &:hover {
                    background-color: var(--note-ext-icon-hover);
                }
            }
        }
        
    }
    .body {
        display: grid;
        grid-gap: 10px;
        
        padding: 5px;

        box-sizing: border-box;

        width: 100%;
    }
}
.collect-manager {
    position: absolute;
}
</style>