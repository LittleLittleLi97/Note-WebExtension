<template>
    <div class="float-box" v-show="boxState" ref="boxDiv">
        <div class="box-inner">
            <i class="iconfont icon-bianji" @click="addCell"></i>
            <i class="iconfont icon-shanchu" v-show="modifyState" @click="deleteHighlight"></i>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from '@vue/runtime-core'
import { nanoid } from 'nanoid';
import PubSub from 'pubsub-js'
import { changeLabelColor, getElementByKey, getElementByPath, getSelectorPath, getTopElementkey, highlightText, removeHighlight, selection, updateSelection } from '@/utils/dom.js';
import { parseReactiveToObj, copyObjToReactive, removeUrlQuery } from '@/utils/utils';
export default {
    name: 'ContextFloatBox',
    emits: ['showNote'],
    setup(props, context) {
        const info = reactive({
            url: '',
            area: {},
        });
        const boxState = ref(false);
        const boxDiv = ref(null);
        const modifyState = ref(false);

        let excludeElement = null; // 排除区域，content页面的主体部分不应该标注highlight
        let range = null;
        let cellId = null;
        let mode = 'highlight';

        onMounted(()=>{
            // 初始化信息
            info.url = removeUrlQuery(window.location.href);
            chrome.runtime.sendMessage({func: 'getHighlightByUrl', url: info.url}, (response)=>{
                if (response) {
                    copyObjToReactive(info, response);
                    let area = info.area;
                    for (let key in area) {
                        const innerHTML = area[key];
                        const el = getElementByKey(key);
                        el.innerHTML = innerHTML;
                    }
                    console.log(info);
                }
            });

            // 排除区域
            excludeElement = document.getElementById('note-ext-main-content-area');

            // 选中文字事件
            document.addEventListener('mouseup', (event)=>{
                if (excludeElement.contains(event.target)) return;
                let text = selection.toString();
                let tCellId = event.target.getAttribute('data-note-ext-cell-id');

                let res = text.length > 0 || tCellId;
                if (res) {
                    // 坐标有问题
                    boxDiv.value.style.cssText = `top: ${event.pageY}px; left: ${event.pageX}px;`;
                    boxState.value = true;
                    if (tCellId) {
                        cellId = tCellId;
                        mode = 'modify';
                        modifyState.value = true;
                    } else if (text.length > 0) {
                        mode = 'highlight';
                        range = selection.getRangeAt(0);
                        modifyState.value = false;
                    } 
                } else {
                    boxState.value = false;
                    modifyState.value = false;
                    selection.empty();
                }
            });

            PubSub.subscribe('changeLabel', (msg, {id, color})=>{
                console.log('get')
                const elList = document.querySelectorAll(`span[data-note-ext-cell-id="${id}"]`);
                elList.forEach((el)=>{
                    changeLabelColor(el, color);
                })
            })
        });

        // 写笔记事件
        function writeFunction() {

            function addCell() {

                if (mode === 'modify') { // 在modify下点击
                    const elList = document.querySelectorAll(`span[data-note-ext-cell-id="${cellId}"]`);
                    let text = '';
                    elList.forEach((el)=>text += el.innerHTML);
                    PubSub.publish('addHighlightCell', {id: cellId, text});
                    selection.empty();
                    return;
                }

                const newCellId = nanoid();
                const el = range.commonAncestorContainer.parentElement;
                const elKey = getTopElementkey(el);
                console.log('range', range);
                updateSelection(range);
                const text = selection.toString();
                highlightText(newCellId, 'blue');

                info.area[elKey] = getElementByKey(elKey).innerHTML;
                console.log('save', info.area)

                chrome.runtime.sendMessage({func: 'save', type: 'highlight', data: info});
                PubSub.publish('addHighlightCell', {id: newCellId, text});
                context.emit('showNote');
            }
            return {
                addCell,
            }
        }

        function modifyFunction() {

            function deleteHighlight() {
                const elList = document.querySelectorAll(`span[data-note-ext-cell-id="${cellId}"]`);
                elList.forEach((item)=>{
                    let key = getTopElementkey(item); // 先拿key，去掉span后找不到parentNode
                    removeHighlight(item);
                    info.area[key] = getElementByKey(key).innerHTML;
                });
                chrome.runtime.sendMessage({func: 'save', type: 'highlight', data: info});
            }
            return {
                deleteHighlight,
            }
        }
        return {
            boxState,
            boxDiv,
            modifyState,
            ...writeFunction(),
            ...modifyFunction(),
        }
    }
}
</script>

<style scoped lang="less">
.float-box {
    position: absolute;
    z-index: 9999;

    // width: 48px;
    // height: 40px;

    padding: 4px;

    background-color: var(--note-ext-theme);

    border-radius: 4px;
    box-shadow: 0px 4px 12px 0px #00000066,0px 0px 2px 0px #0000003F;

    box-sizing: border-box;

    .box-inner {
        display: flex;
        justify-content: center;
        align-items: center;

        .iconfont {
            font-size: 24px;
            color: var(--note-ext-font);
            line-height: 32px;
            text-align: center;

            width: 32px;
            height: 32px;

            margin: 0 2px;

            border-radius: 4px;
    
            box-sizing: border-box;

            cursor: pointer;

            &:hover {
                background-color: var(--note-ext-context-hover);
            }
        }
    }
}
</style>