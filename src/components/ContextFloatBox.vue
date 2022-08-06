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
import { addCellDataIdForElement, getHighlightInfo, highlightText, selection } from '@/utils/dom.js';
export default {
    name: 'ContextFloatBox',
    emits: ['showNote'],
    setup(props, context) {
        const boxState = ref(false);
        const floatBoxDiv = ref(null);
        // let selection = null;
        let range = null;
        onMounted(()=>{
            document.addEventListener('mouseup', (event)=>{
                // selection = window.getSelection();
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
        function addCell() {
            let highlightInfo = getHighlightInfo(range); // 高光操作之前
            // highlightText(range);

            const newCellId = nanoid();
            addCellDataIdForElement(range, newCellId);
            PubSub.publish('addHighlightCell', {
                id: newCellId,
                highlightInfo,
            });
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