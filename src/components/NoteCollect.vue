<template>
    <div class="pop-content" @contextmenu="openContextMenu" @click="closeContextMenu">
        <div class="header">
            <div class="title">MyNote</div>
            <i class="iconfont icon-gengduo"></i>
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
            @closeContextMenu="closeContextMenu"
            @deleteItem="deleteItem"
            @renameItem="renameItem"
        ></CollectManager>
    </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from '@vue/runtime-core'
import FolderSection from '@/components/FolderSection'
import CollectManager from '@/components/CollectManager'
import PubSub from 'pubsub-js'
export default {
    name: 'NoteCollect',
    components: {
        FolderSection,
        CollectManager
    },
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
            let noteId = null; // 用于记录这是对note的操作还是collect的操作，应该保持只有一个不为null
            let collectId = null;
            function openContextMenu(event) {
                const path = event.path;
                let flag = false;
                path.forEach((item)=>{
                    try {
                        let tempNoteId = item.getAttribute('data-noteId');
                        let tempCollectId = item.getAttribute('data-collectId');
                        if (tempNoteId || tempCollectId) {
                            if (tempNoteId) noteId = tempNoteId;
                            if (tempCollectId) collectId = tempCollectId;
                            flag = true;
                            event.preventDefault();
                            collectManagerDiv.value.style.cssText = `top: ${event.pageY}px; left: ${event.pageX}px;`;
                            collectManagerShow.value = true;
                        }
                    } catch (error) {
                    }
                });
                if (!flag) { // 右键了别的地方
                    closeContextMenu();
                    // noteId = null;
                    // collectId = null;
                }
                console.log('open', collectId, noteId)
            }
            function closeContextMenu() {
                collectManagerShow.value = false;
                noteId = null;
                collectId = null;
            }
            function deleteItem() { // 没有删除cell
                console.log('delete', collectId, noteId)
                if (collectId) {
                    console.log('delete collect')
                    chrome.runtime.sendMessage({func: 'delete', type: 'collect', id: collectId});
                    let children = collectList[collectId].children;
                    children.forEach((item)=>{
                        chrome.runtime.sendMessage({func: 'delete', type: 'note', id: item});
                    });
                    delete collectList[collectId];
                }
                if (noteId) {
                    console.log('delete note id: ', noteId);
                    let id = noteId; // 异步的原因，response的回调中noteId已被改为null, 需要保存下来
                    chrome.runtime.sendMessage({func: 'getNoteById', id}, (response)=>{
                        // 找到collect的id
                        let collect = collectList[response.collect_id]
                        let children = collect.children;
                        let index = children.indexOf(id);
                        if (index !== -1) children.splice(index, 1);
                        chrome.runtime.sendMessage({func: 'save', type: 'collect', data: collect});
                        chrome.runtime.sendMessage({func: 'delete', type: 'note', id});
                    })
                }
                collectId = null;
                noteId = null;
            }
            function renameItem() {
                if (collectId) {
                    let id = collectId;
                    PubSub.publish('renameCollect', id);
                    PubSub.subscribe('renameCollectFinish', (msg, newName)=>{
                        console.log('renameCollectFinish', newName)
                        collectList[id].name = newName;
                        chrome.runtime.sendMessage({func: 'save', type: 'collect', data: collectList[id]});
                        let children = collectList[id].children;
                        children.forEach((item)=>{
                            chrome.runtime.sendMessage({func: 'getNoteById', id: item}, (response)=>{
                                response.collect = newName;
                                chrome.runtime.sendMessage({func: 'save', type: 'note', data: response});
                            });
                        });
                        PubSub.unsubscribe('renameCollectFinish');
                    });
                }
                if (noteId) {
                    let id = noteId;
                    PubSub.publish('renameNote', id);
                }
            }
            return {
                collectManagerShow,
                collectManagerDiv,
                openContextMenu,
                closeContextMenu,
                deleteItem,
                renameItem,
            }
        }
        return {
            collectList,
            ...collectManagerFunction(),
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
        }
        .iconfont {
            font-size: 22px;
            text-align: center;
            line-height: 30px;

            width: 30px;
            height: 30px;

            border-radius: 5px;

            cursor: pointer;

            transition: background-color 0.2s;

            &:hover {
                background-color: var(--note-ext-icon-hover);
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