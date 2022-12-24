<template>
    <div class="pop-content">
        <div class="header">
            <div class="title">MyNote</div>
            <div class="icons">
                <i class="iconfont icon-folder-add" @click="createCollectShow=true"></i>
                <i class="iconfont icon-gengduo"></i>
                <!-- <Tooltip></Tooltip> -->
            </div>  
        </div>
        <div class="body">
            <FolderSection 
                v-for="item in collectList" 
                :key="item.id" 
                :collectInfo="item" 
            />
        </div>
    </div>
    <CreateCollect v-model:show="createCollectShow"></CreateCollect>
</template>

<script setup lang="ts">
import { usePopupStore } from '@/store/popupStore';
import { ref, computed, onMounted } from 'vue';

import FolderSection from '@/components/popup/FolderSection.vue'
import CreateCollect from './CreateCollect.vue';

// 初始化
const store = usePopupStore();
const collectList = computed(()=>store.collectList);

onMounted(async()=>{
    await store.initDB();
    store.tempUpdateDB();
    store.getCollectList();
})

// CreateCollect
const createCollectShow = ref(false);
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
</style>