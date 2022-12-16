<template>
    <transition>
        <div class="note-wrapper">
            <div class="note-main-area">

                <div class="note-header">
                    <div class="header-top">
                        <HeaderTitle></HeaderTitle>
                        <HeaderMore></HeaderMore>
                    </div>
                    <HeaderClassification></HeaderClassification>
                </div>
                <div class="cell-area">
                    <CellCard 
                        v-for="cellId in noteInfo.children"
                        :key="cellId"
                        :cellId="cellId"
                    ></CellCard>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from '@vue/runtime-core';
import { defineEmits } from 'vue';
import { useContentStore } from '@/store/contentStore';
import HeaderTitle from './parts/HeaderTitle.vue';
import HeaderMore from './parts/HeaderMore.vue';
import HeaderClassification from './parts/HeaderClassification.vue';
import CellCard from './parts/CellCard.vue';

const emit = defineEmits(['showNote', 'closeNote']);
const store = useContentStore();

const noteInfo = computed(()=>store.noteInfo);

onMounted(()=>{
    store.initStore();
})

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

    .note-main-area {
        .note-header {
            padding: 14px 16px;
    
            border-bottom: 1px solid var(--note-ext-line);
    
            box-sizing: border-box;
    
            .header-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
    
                width: 100%;
                height: 56px;
    
                // margin-left: 5px; // 下面收藏夹hover动画的padding的5px，这里设置让文字对齐。
            }
        }
        .cell-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
    
            padding: 10px 20px;
    
            overflow-y: scroll;
            scroll-behavior: contain;
    
            &::-webkit-scrollbar {
                display: none;
            }
            .add-cell-button {
                text-align: center;
    
                width: 50%;
    
                margin-top: 10px;
    
                background-color: transparent;
    
                border: 2px solid var(--note-ext-font);
                border-radius: 5px;
    
                box-sizing: border-box;
    
                cursor: pointer;
    
                transition: background-color 0.2s;
    
                &:hover {
                    background-color: var(--note-ext-context-hover);
                }
                .iconfont {
                    font-size: 20px;
                    color: var(--note-ext-font);
                }
            }
        }
    }
    .note-manager {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10000;
    }
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>