<template>
    <div class="cell-card">
        <div class="label" :style="`background-color: var(--note-ext-${cellInfo.label});`"></div>
        <div class="cell-right">
            <div class="content">
                {{ cellInfo.content }}
            </div>
        </div>
    </div>
</template>

<script>
import { computed, createHydrationRenderer, onMounted, reactive, resolveComponent } from '@vue/runtime-core'
import { copyObjToReactive } from '@/utils/utils';
export default {
    name: 'CellCard',
    props: {
        cellId: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const cellId = computed(()=>props.cellId);
        const cellInfo = reactive({});
        onMounted(()=>{
            chrome.runtime.sendMessage({func: 'getCellById', id: cellId.value}, (response)=>{
                copyObjToReactive(cellInfo, response);
            });
        })
        return {
            cellInfo
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

        font-size: 16px;
        line-height: normal;

        margin-left: 10px;
    }
}
</style>