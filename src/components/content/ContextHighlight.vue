<template>
    <div class="float-box" v-show="boxState" ref="boxDiv">
        <div class="box-inner">
            <i class="iconfont icon-bianji" @click="addCell"></i>
            <i class="iconfont icon-find" v-show="modifyState" @click="findCell"></i>
            <i class="iconfont icon-shanchu" v-show="modifyState" @click="deleteHighlightEvent"></i>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, defineEmits, inject } from 'vue';
import { nanoid } from 'nanoid';
import PubSub from 'pubsub-js'
import { changeLabelColor, getAllElementsByCellId, getElementByKey, getTopElementkey, highlightText, removeHighlight, selection, updateSelection } from '@/utils/dom';
import { useContentStore } from '@/store/contentStore';
import { isEmptyObj } from '@/utils/utils';
import { showControlFuncObj } from '@/utils/interface';

const emit = defineEmits(['showNote', 'closeNote']);
const { showNote, closeNote } = inject<showControlFuncObj>('showControl')!;
const store = useContentStore();

const info = computed(()=>store.highlight);
const boxState = ref(false);
const boxDiv = ref();
const modifyState = ref(false);

let excludeElement: HTMLElement; // 排除区域，content页面的主体部分不应该标注highlight
let range: Range;
let cellId = '';
let contextMode = 'highlight';
const sourceArea: {[key: string]: HTMLElement} = {}; // 保留的原始dom

let mode = 'highlight';
watch(()=>info.value.area, (newValue, oldValue)=>{
    if (isEmptyObj(oldValue)) _highlight();
})
function addCell() {

    if (contextMode === 'modify') { // 在modify下点击
        const elList = getAllElementsByCellId(cellId);
        let text = '';
        elList.forEach((el)=>text += el.innerHTML);
        store.addHighlightCell(cellId, text);
        selection.empty();
        return;
    }

    const newCellId = nanoid();
    const elKey = getTopElementkey(range.commonAncestorContainer.parentElement as HTMLElement);
    const el = getElementByKey(elKey);
    if (!sourceArea[elKey]) sourceArea[elKey] = el.innerHTML;

    updateSelection(range);
    const text = selection.toString();
    highlightText(newCellId, 'blue');

    info.value.area[elKey] = el.innerHTML;

    store.saveHighlight();
    store.addHighlightCell(newCellId, text);
    emit('showNote');
}
function findCell() {
    showNote();
}
function deleteHighlightEvent() {
    const hasCell = store.cellList[cellId];
    if (hasCell) {
        PubSub.publish('deleteStartEmit', '笔记');
        PubSub.subscribe('deleteEndEmit', (msg, isDelete: boolean)=>{
            if (isDelete) store.deleteCell(cellId);
            _deleteHighlight(cellId);
            PubSub.unsubscribe('deleteEndEmit');
        });
    } else {
        _deleteHighlight(cellId);
    }
}

onMounted(()=>{
    // 排除区域
    excludeElement = document.getElementById('note-ext-main-content-area') as HTMLElement;
    
    // 选中文字事件
    document.addEventListener('mouseup', (event: MouseEvent)=>{
        if (mode !== 'highlight') return;
        if (excludeElement.contains(event.target as HTMLElement)) return;
        let text = selection.toString();
        let tCellId = (event.target as HTMLElement).getAttribute('data-note-ext-cell-id');

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
        }
    });

    PubSub.subscribe('changeLabel', (msg, {id, color})=>{
        const elList = getAllElementsByCellId(id);
        elList.forEach((el)=>{
            changeLabelColor(el as HTMLElement, color);
            const elKey = getTopElementkey(el as HTMLElement);
            info.value.area[elKey] =  getElementByKey(elKey).innerHTML;
        });
        store.saveHighlight();
    })
    PubSub.subscribe('findHighlight', (msg, cell_id: string)=>{
        const elList = getAllElementsByCellId(cell_id);
        const el = elList[0] as HTMLElement;
        window.scrollTo(el.offsetLeft, el.offsetTop);
    })
    PubSub.subscribe('deleteHighlight', (msg, cell_id: string)=>{
        _deleteHighlight(cell_id);
    })
    PubSub.subscribe('changeMode', (msg, toMode: string)=>{
        switch (toMode) {
            case 'highlight':
                _highlight();
                break;
            case 'source':
                _source();
                break;
        }
    })
    PubSub.subscribe('clearAllHighlight', ()=>{
        let nowMode = mode;
        _source();
        info.value.area = {};
        store.saveHighlight();
        if (nowMode === 'highlight') _highlight();
    })
})

function _highlight() {
    const area = info.value.area;
    mode = 'highlight';
    for (let key in area) {
        const innerHTML = area[key];
        const el = getElementByKey(key);
        sourceArea[key] = el.innerHTML;
        el.innerHTML = innerHTML;
    }
}

function _source() {
    const area = info.value.area;
    mode = 'source';
    for (let key in sourceArea) {
        const el = getElementByKey(key);
        el.innerHTML = sourceArea[key];
    }
}

function _deleteHighlight(cell_id: string) {
    const elList = getAllElementsByCellId(cell_id);
        elList.forEach((item)=>{
            let key = getTopElementkey(item as HTMLElement); // 先拿key，去掉span后找不到parentNode
            removeHighlight(item as HTMLElement);
            info.value.area[key] = getElementByKey(key).innerHTML;
        });
        store.deleteHighlight();
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