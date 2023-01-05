<template>
    <div class="more">
        <i class="iconfont icon-pen" :style="mode.style" @click="changeMode"></i>
        <i class="iconfont icon-gengduo" ref="openMoreDiv" @click="(moreMenuShow=true)"></i>
        <i class="iconfont icon-shanchu2" @click="closeNote()"></i>
        <div class="more-gengduo" v-show="moreMenuShow"  @click="(moreMenuShow=false)">
            <div class="more-list">
                <base-menu>
                    <base-menu-item
                        icon="iconfont icon-file-txt-fill"
                        :title="i18n.export + ' txt'"
                        @click="exportNote('txt')"
                    ></base-menu-item>
                    <base-menu-item
                        icon="iconfont icon-file-markdown"
                        :title="i18n.export + ' md'"
                        @click="exportNote('md')"
                    ></base-menu-item>
                    <base-menu-line></base-menu-line>
                    <base-menu-item
                        icon="iconfont icon-shanchu"
                        :title="i18n.clear_highlight"
                        @click="clearAllHighlight"
                    ></base-menu-item>
                </base-menu>
            </div>
            <div class="mask"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, reactive, computed } from 'vue';
import PubSub from 'pubsub-js'
import baseMenu from '@/components/base/base-menu.vue';
import baseMenuItem from '@/components/base/base-menu-item.vue';
import baseMenuLine from '@/components/base/base-menu-line.vue';
import { showControlFuncObj } from '@/utils/interface'
import { downloadNote } from '@/utils/utils';
import { useContentStore } from '@/store/contentStore';

const i18n = reactive({
    export: chrome.i18n.getMessage('export'),
    clear_highlight: chrome.i18n.getMessage('clear_highlight')
});
const { showNote, closeNote } = inject<showControlFuncObj>('showControl')!;
const store = useContentStore();

const moreMenuShow = ref(false);

const modeList = [
    {
        mode: 'highlight',
        style: 'color: var(--note-ext-yellow);',
    },
    {
        mode: 'source',
        style: 'color: #fff;',
    }
]
const modeIndex = ref(0);
const mode = computed(()=>modeList[modeIndex.value]);
function changeMode() {
    modeIndex.value = (modeIndex.value + 1) % modeList.length;
    PubSub.publish('changeMode', modeList[modeIndex.value].mode);
}

function exportNote(type: string) {
    downloadNote(type, store.noteInfo.id);
}
function clearAllHighlight() {
    PubSub.publish('clearAllHighlight');
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