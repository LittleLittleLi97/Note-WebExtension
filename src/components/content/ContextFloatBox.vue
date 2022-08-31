<template>
    <div class="float-box" v-show="boxState" ref="boxDiv">
        <div class="box-inner">
            <i class="iconfont icon-bianji" @click="addCell"></i>
            <i class="iconfont icon-shanchu" v-show="modifyState" @click="deleteHighlightStart"></i>
        </div>
    </div>
    <base-dialog 
        v-show="deleteDialogShow" 
        text="是否删除对应的笔记部分？"
        @closeFunction="deleteHighlightEnd"
        @cancelFunction="deleteHighlight"
        @confirmFunction="deleteHighlightAndCell"
    ></base-dialog>
</template>

<script>
import { onMounted, reactive, ref } from '@vue/runtime-core'
import { nanoid } from 'nanoid';
import PubSub from 'pubsub-js'
import baseDialog from '@/components/base/base-dialog'
import { changeLabelColor, getElementByKey, getElementByPath, getSelectorPath, getTopElementkey, highlightText, removeHighlight, selection, updateSelection } from '@/utils/dom.js';
import { parseReactiveToObj, copyObjToReactive, removeUrlQuery } from '@/utils/utils';
import { isEmptyObj } from '@/utils/jsExt';
export default {
    name: 'ContextFloatBox',
    emits: ['showNote'],
    components: {
        baseDialog,
    },
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
        let contextMode = 'highlight';
        const sourceArea = {}; // 保留的原始dom
        let mode = 'highlight';

        onMounted(()=>{
            // 初始化信息
            info.url = removeUrlQuery(window.location.href);
            chrome.runtime.sendMessage({func: 'getHighlightByUrl', url: info.url}, (response)=>{
                if (response) {
                    copyObjToReactive(info, response);
                    _highlight();
                    // if (!isEmptyObj(info.area)) 
                    PubSub.publish('changeModeFromContext', 'highlight');
                }
            });

            // 排除区域
            excludeElement = document.getElementById('note-ext-main-content-area');

            // 选中文字事件
            document.addEventListener('mouseup', (event)=>{
                if (mode !== 'highlight') return;
                if (excludeElement.contains(event.target)) return;
                let text = selection.toString();
                let tCellId = event.target.getAttribute('data-note-ext-cell-id');

                let res = text.length > 0 || tCellId;
                if (res) {
                    boxDiv.value.style.cssText = `top: ${event.pageY}px; left: ${event.pageX}px;`;
                    boxState.value = true;
                    if (tCellId) {
                        cellId = tCellId;
                        contextMode = 'modify';
                        modifyState.value = true;
                    } else if (text.length > 0) {
                        contextMode = 'highlight';
                        range = selection.getRangeAt(0);
                        modifyState.value = false;
                    } 
                } else {
                    boxState.value = false;
                    modifyState.value = false;
                    // selection.empty();
                }
            });

            // 更改标签
            PubSub.subscribe('changeLabel', (msg, {id, color})=>{
                console.log('get')
                const elList = document.querySelectorAll(`span[data-note-ext-cell-id="${id}"]`);
                elList.forEach((el)=>{
                    changeLabelColor(el, color);
                })
            });

            // 显示highlight还是原网页
            PubSub.subscribe('changeModeFromNote', (msg, toMode)=>{
                if (toMode === 'highlight') {
                    _highlight();
                } else if (toMode === 'source') {
                    _source();
                }
            });

            // 删除cell时的删除highlight
            PubSub.subscribe('deleteHighlight', (msg, id)=>{
                _deleteHighlight(id);
            });

            // 清空highlight
            PubSub.subscribe('clearAllHighlight', ()=>{
                let nowMode = mode;
                _source();
                info.area = {};
                chrome.runtime.sendMessage({func: 'save', type: 'highlight', data: info});
                if (nowMode === 'highlight') _highlight();
            });
        });

        function _highlight() {
            const area = info.area;
            mode = 'highlight';
            for (let key in area) {
                const innerHTML = area[key];
                const el = getElementByKey(key);
                sourceArea[key] = el.innerHTML;
                el.innerHTML = innerHTML;
            }
        }

        function _source() {
            const area = info.area;
            mode = 'source';
            for (let key in sourceArea) {
                const el = getElementByKey(key);
                el.innerHTML = sourceArea[key];
            }
        }

        // 写笔记事件
        function writeFunction() {

            function addCell() {

                if (contextMode === 'modify') { // 在modify下点击
                    const elList = document.querySelectorAll(`span[data-note-ext-cell-id="${cellId}"]`);
                    let text = '';
                    elList.forEach((el)=>text += el.innerHTML);
                    PubSub.publish('addHighlightCell', {id: cellId, text});
                    selection.empty();
                    return;
                }

                const newCellId = nanoid();
                const elKey = getTopElementkey(range.commonAncestorContainer.parentElement);
                const el = getElementByKey(elKey);
                if (!sourceArea[elKey]) sourceArea[elKey] = el.innerHTML;

                updateSelection(range);
                const text = selection.toString();
                highlightText(newCellId, 'blue');

                info.area[elKey] = el.innerHTML;
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
            const deleteDialogShow = ref(false);
            function deleteHighlightStart() {
                chrome.runtime.sendMessage({func: 'getById', type: 'cell', id: cellId}, (response)=>{
                    if (response) {
                        deleteDialogShow.value = true;
                    } else {
                        _deleteHighlight(cellId);
                    }
                });
            }
            function deleteHighlightEnd() {
                deleteDialogShow.value = false;
            }
            function deleteHighlight() {
                deleteHighlightEnd();
                _deleteHighlight(cellId);
            }
            function deleteHighlightAndCell(){
                deleteHighlightEnd();
                deleteHighlight();
                console.log('hl', cellId);
                PubSub.publish('deleteCell', cellId);
            }
            return {
                deleteDialogShow,
                deleteHighlightStart,
                deleteHighlightEnd,
                deleteHighlight,
                deleteHighlightAndCell,
            }
        }
        function _deleteHighlight(cellId) {
            const elList = document.querySelectorAll(`span[data-note-ext-cell-id="${cellId}"]`);
                elList.forEach((item)=>{
                    let key = getTopElementkey(item); // 先拿key，去掉span后找不到parentNode
                    removeHighlight(item);
                    info.area[key] = getElementByKey(key).innerHTML;
                });
            chrome.runtime.sendMessage({func: 'save', type: 'highlight', data: info});
            // 更改cell记录中的highlight标记
            chrome.runtime.sendMessage({func: 'getById', type: 'cell', id: cellId}, (response)=>{
                if (response) {
                    response.highlight = false;
                    chrome.runtime.sendMessage({func: 'save', type: 'cell', data: response});
                }
            })
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