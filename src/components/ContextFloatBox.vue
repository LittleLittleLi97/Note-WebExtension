<template>
    <div class="float-box" v-show="boxState" ref="floatBoxDiv" @click="addCell">
        <div class="box-inner">
            <i class="iconfont icon-bianji"></i>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from '@vue/runtime-core'
import { nanoid } from 'nanoid';
import PubSub from 'pubsub-js'
import { addCellDataIdForElement, getHighlightInfo, highlightByInfo, highlightText, selection } from '@/utils/dom.js';
import { parseReactiveToObj, copyObjToReactive, removeUrlQuery } from '@/utils/utils';
export default {
    name: 'ContextFloatBox',
    emits: ['showNote'],
    setup(props, context) {
        const boxState = ref(false);
        const floatBoxDiv = ref(null);
        const info = reactive({
            url: '',
            area: {},
        })
        let range = null;
        onMounted(()=>{
            // 初始化信息
            info.url = removeUrlQuery(window.location.href);
            chrome.runtime.sendMessage({func: 'getHighlightByUrl', url: info.url}, (response)=>{
                if (response) {
                    copyObjToReactive(info, response);
                    for (let key in info.area) {
                        highlightByInfo(info.area[key]);
                    }
                }
            });

            // 选中文字事件
            document.addEventListener('mouseup', (event)=>{
                let text = selection.toString();
                if (text) {
                    // 坐标有问题
                    floatBoxDiv.value.style.cssText = `top: ${event.clientY}px; left: ${event.clientX}px;`;
                    boxState.value = true;

                    // 存储range
                    range = selection.getRangeAt(0);
                } else {
                    boxState.value = false;
                }
            })
        });
        // 写笔记事件
        function addCell() {
            let highlightInfo = getHighlightInfo(range); // 高光操作之前
            highlightText(range);

            const newCellId = nanoid();
            addCellDataIdForElement(range, newCellId);
            info.area[newCellId] = highlightInfo;
            console.log('save', info.area)
            chrome.runtime.sendMessage({
                func: 'save',
                type: 'highlight',
                data: parseReactiveToObj(info)
            });
            PubSub.publish('addHighlightCell', newCellId);
            context.emit('showNote');
        }
        return {
            boxState,
            floatBoxDiv,
            addCell,
        }
    }
}
</script>

<style scoped lang="less">
.float-box {
    position: absolute;
    z-index: 9999;

    width: 48px;
    height: 40px;

    padding: 4px;

    background-color: var(--note-ext-theme);

    border-radius: 4px;
    box-shadow: 0px 4px 12px 0px #00000066,0px 0px 2px 0px #0000003F;

    box-sizing: border-box;

    .box-inner {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 40px;
        height: 32px;

        padding: 4px 8px;

        border-radius: 4px;

        box-sizing: border-box;

        &:hover {
            background-color: var(--note-ext-context-hover);
        }
        .iconfont {
            font-size: 24px;
            color: var(--note-ext-font);
        }
    }
}
</style>