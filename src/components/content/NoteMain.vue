<template>
    <transition>
        <div class="note-wraper">
            
        </div>
    </transition>
</template>

<script setup lang="ts">
import { reactive, ref } from '@vue/reactivity'
import { computed, nextTick, onMounted, watch } from '@vue/runtime-core';
import { defineEmits } from 'vue';
import { nanoid } from 'nanoid'
import { useContentStore } from '@/store/contentStore';
// import PubSub from 'pubsub-js'
// import { copyObjToReactive, removeUrlQuery, parseReactiveToObj, download, downloadNote } from '@/utils/utils'
// import CellCard from '@/components/content/CellCard'
// import NoteManager from '@/components/content/NoteManager'
// import baseMenu from '@/components/base/base-menu'
// import baseMenuItem from '@/components/base/base-menu-item'
// import baseMenuLine from '@/components/base/base-menu-line'
// import baseDialog from '@/components/base/base-dialog'
// import Tooltip from '@/components/others/Tooltip'

const emit = defineEmits(['showNote', 'closeNote']);
const store = useContentStore();

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
    
                .more {
                    position: relative;

                    display: flex;
                    align-items: center;

                    .iconfont {
                        font-size: 22px;
                        text-align: center;
                        line-height: 30px;
    
                        width: 30px;
                        height: 30px;
        
                        margin-left: 12px;
    
                        border-radius: 5px;
    
                        transition: background-color 0.2s;
    
                        cursor: pointer;
    
                        &:hover {
                            background-color: var(--note-ext-icon-hover);
                        }
                    }
                    .more-gengduo {
                        position: absolute;
                        top: -3px;
                        right: 70px;
                    }
                }
            }
            .classification-area {
                display: inline-flex; // 宽度自适应，不占整行
                justify-content: center;
                align-items: center;
    
                padding: 2px 5px;
    
                border-radius: 5px;
    
                box-sizing: border-box;
    
                transition: background-color 0.2s;
    
                cursor: pointer;
    
                &:hover {
                    background-color: var(--note-ext-icon-hover);
                }

                &:focus {
                    background-color: var(--note-ext-icon-hover);
                }

                .iconfont {
                    font-size: 20px;
                }
                .classification {
                    font-size: 16px;
                    color: var(--note-ext-font);
                    font-family: Segoe UI;
                    font-weight: Semilight;
                    line-height: normal;
                    letter-spacing: 0px;
                    text-align: left;
    
                    width: 100px;

                    margin: 0px 0px 0px 10px;
    
                    background-color: transparent;
    
                    border: none;
    
                    outline: none;
    
                    cursor: pointer;
    
                    -webkit-appearance: none;

                    option {
                        color: var(--note-ext-font);
                        background-color: var(--note-ext-theme2);
                    }
                }
                .collect-input {
                    color: inherit;

                    width: 100px;

                    margin-left: 10px;

                    background-color: transparent;

                    border: none;
                    outline: none;
                }
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
            .cell-card {
                margin-top: 10px;
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