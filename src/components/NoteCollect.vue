<template>
    <div class="pop-content" @contextmenu="openContextMenu" @click="closeContextMenu">
        <div class="header">
            <div class="title">笔记收藏夹</div>
            <div class="more">···</div>
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
        <CollectManager></CollectManager>
    </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from '@vue/runtime-core'
import FolderSection from '@/components/FolderSection'
import CollectManager from '@/components/CollectManager'
export default {
    name: 'NoteCollect',
    components: {
        FolderSection,
        CollectManager
    },
    setup() {
        // 初始化数据
        const collectList = ref({});
        onMounted(()=>{
            chrome.runtime.sendMessage({func: 'getCollect'}, (response)=>{
                collectList.value = response;
            });
        })

        // 右键管理
        const collectManagerShow = ref(false);
        const collectManagerDiv = ref(null);
        function openContextMenu(event) {
            const path = event.path;
            let flag = false;
            path.forEach((item)=>{
                try {
                    let noteId = item.getAttribute('data-noteId');
                    if (noteId) {
                        flag = true;
                        event.preventDefault();
                        collectManagerDiv.value.style.cssText = `top: ${event.pageY}px; left: ${event.pageX}px;`;
                        collectManagerShow.value = true;
                    }
                } catch (error) {
                }
            });
            if (!flag) closeContextMenu(); // 右键了别的地方
        }
        function closeContextMenu() {
            collectManagerShow.value = false;
        }
        return {
            collectList,

            collectManagerShow,
            collectManagerDiv,
            openContextMenu,
            closeContextMenu,
        }
    }
}
</script>

<style scoped lang="less">
.pop-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    color: #fff;

    width: 330px;
    height: 520px;

    background-color: #4A4A4A;

    border: 1px solid black;

    box-sizing: border-box;
    box-shadow: 0px 16px 30px 0px #0000003F;

    overflow-y: scroll;
    scroll-behavior: contain;

    .header {
        display: flex;
        justify-content: space-between;

        width: 100%;
        
        padding: 16px 16px;

        border-bottom: 1px solid #5F5F5F;

        box-sizing: border-box;
        
        .title {
            font-size: 22px;
        }
        .more {
            font-size: 22px;
        }
    }
    .body {
        display: grid;
        grid-gap: 10px;

        margin-top: 10px;
        margin-left: 25px;

        width: 100%;
    }
}
.collect-manager {
    position: absolute;
}
</style>