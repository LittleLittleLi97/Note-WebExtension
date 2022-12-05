<template>
    <div class="more">
        <i class="iconfont icon-pen" style="color: var(--note-ext-yellow);" ref="modeShowDiv" @click="changeMode"></i>
        <i class="iconfont icon-gengduo" ref="openMoreDiv" @click="openMoreMenu"></i>
        <i class="iconfont icon-shanchu2" @click="closeNote()"></i>
        <div class="more-gengduo" v-show="moreMenuShow"  @click="(moreMenuShow=false)">
            <div class="more-list">
                <base-menu>
                    <base-menu-item
                        icon="iconfont icon-file-txt-fill"
                        title="导出txt"
                        @click="exportNote('txt')"
                    ></base-menu-item>
                    <base-menu-item
                        icon="iconfont icon-file-markdown"
                        title="导出md"
                        @click="exportNote('md')"
                    ></base-menu-item>
                    <!-- <base-menu-line></base-menu-line>
                    <base-menu-item
                        icon="iconfont icon-shanchu"
                        title="清空标注"
                        @click="clearAllHighlight"
                    ></base-menu-item> -->
                </base-menu>
            </div>
            <div class="mask"></div>
        </div>
        <!-- <div>
            <Tooltip></Tooltip>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import baseMenu from '@/components/base/base-menu.vue';
import baseMenuItem from '@/components/base/base-menu-item.vue';
import baseMenuLine from '@/components/base/base-menu-line.vue';
import { showControlFuncObj } from '@/utils/interface'

const { showNote, closeNote } = inject<showControlFuncObj>('showControl')!;

const modeShowDiv = ref();
const moreMenuShow = ref(false);

function changeMode() {
    1
}
function openMoreMenu() {
    moreMenuShow.value = true;
}
function exportNote(a: any) {
    1
}
</script>

<style scoped lang="less">
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

        .more-list {
            position: absolute;
            z-index: 2;
            right: 0;
        }

        .mask {
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;

            width: 100%;
            height: 100%;
        }
    }
}
</style>