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
            let noteId = null;
            let collectId = null;
            path.forEach((item)=>{
                try {
                    noteId = item.getAttribute('data-noteId');
                    collectId = item.getAttribute('data-collectId');
                    if (noteId || collectId) {
                        flag = true;
                        event.preventDefault();
                        collectManagerDiv.value.style.cssText = `top: ${event.pageY}px; left: ${event.pageX}px;`;
                        collectManagerShow.value = true;
                        throw Error('跳出循环');
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