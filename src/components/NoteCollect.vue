<template>
    <div class="pop-content" @contextmenu="openContextMenu">
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
</template>

<script>
import { computed, onMounted, reactive, ref } from '@vue/runtime-core'
import FolderSection from '@/components/FolderSection'
export default {
    name: 'NoteCollect',
    components: {
        FolderSection,
    },
    setup() {
        const collectList = ref(null);
        onMounted(()=>{
            chrome.runtime.sendMessage({func: 'getCollect'}, (response)=>{
                collectList.value = response;
            });
        })
        function openContextMenu(event) {
            const path = event.path;
            path.forEach((item)=>{
                try {
                    let noteId = item.getAttribute('data-noteId');
                    if (noteId) {
                        
                    }
                } catch (error) {
                }
            })
        }
        return {
            collectList,
            openContextMenu
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
</style>