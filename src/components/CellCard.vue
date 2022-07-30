<template>
    <div class="cell-card">
        <div class="label" :style="`background-color: var(--note-ext-${cellInfo.label});`"></div>
        <div class="cell-right">
            <div class="content" contenteditable="true" @input="inputEvent">
                {{ cellInfo.content }}
            </div>
        </div>
    </div>
</template>

<script>
import { computed, createHydrationRenderer, onMounted, reactive, ref, resolveComponent, watch } from '@vue/runtime-core'
import { copyObjToReactive, parseReactiveToObj } from '@/utils/utils';
export default {
    name: 'CellCard',
    props: {
        cellId: {
            type: String,
            default: null
        }
    },
    emits: ['saveNote'],
    setup(props, context) {
        const cellId = computed(()=>props.cellId);
        const cellInfo = reactive({
            id: cellId.value,
            content: '',
            label: 'blue',
        });
        const isNewCell = ref(false);
        let timer = null;
        function inputEvent(event) {
            cellInfo.content = event.target.innerHTML;
            saveCellInfo();
        }
        function saveCellInfo() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                chrome.runtime.sendMessage({
                    func: 'save',
                    type: 'cell',
                    data: parseReactiveToObj(cellInfo)
                });
                if (isNewCell.value) { // 新的Cell，或许Note也是新的，目前此条语句无用
                    isNewCell.value = false;
                }
                context.emit('saveNote', {
                    newContent: cellInfo.content.slice(0, 30)
                });
            }, 1000);
        }
        onMounted(()=>{
            chrome.runtime.sendMessage({func: 'getCellById', id: cellId.value}, (response)=>{
                if (response) {
                    copyObjToReactive(cellInfo, response);
                } else {
                    isNewCell.value = true;
                }
            });
        })
        return {
            cellInfo,
            inputEvent
        }
    }
}
</script>

<style scoped lang="less">
.cell-card {
    display: flex;

    color: var(--note-ext-font);

    width: 100%;

    padding: 10px;

    background-color: var(--note-ext-card);

    box-sizing: border-box;

    .label {
        width: 16px;
        height: 16px;
        
        margin-top: 2px;

        border-radius: 50%;
    }
    .cell-right {
        flex: 1;
        
        width: 312px;

        font-size: 16px;
        line-height: normal;

        margin-left: 10px;
    }
}
</style>