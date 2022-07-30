<template>
    <div class="cell-card">
        <div class="label" :style="`background-color: var(--note-ext-${cellInfo.label});`"></div>
        <div class="cell-right">
            <el-input
                v-model="cellInfo.content"
                autosize
                type="textarea"
                placeholder="Please input"
                :input-style="textareaStyle"
                resize="none"
            />
        </div>
    </div>
</template>

<script>
import { computed, createHydrationRenderer, onMounted, reactive, ref, resolveComponent, watch } from '@vue/runtime-core'
import { copyObjToReactive, parseReactiveToObj } from '@/utils/utils';
import { ElInput } from 'element-plus'
export default {
    name: 'CellCard',
    props: {
        cellId: {
            type: String,
            default: null
        }
    },
    emits: ['saveNote'],
    components: {
        ElInput
    },
    setup(props, context) {
        // 初始化信息
        const cellId = computed(()=>props.cellId);
        const cellInfo = reactive({
            id: cellId.value,
            content: '',
            label: 'blue',
        });
        onMounted(()=>{
            chrome.runtime.sendMessage({func: 'getCellById', id: cellId.value}, (response)=>{
                if (response) {
                    copyObjToReactive(cellInfo, response);
                }
            });
        })

        // 保存信息
        watch(()=>cellInfo.content, saveCellInfo);
        let timer = null;
        function saveCellInfo() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                chrome.runtime.sendMessage({
                    func: 'save',
                    type: 'cell',
                    data: parseReactiveToObj(cellInfo)
                });
                context.emit('saveNote', { // 更新Note信息
                    newContent: cellInfo.content.slice(0, 30)
                });
                console.log('保存成功')
            }, 1000);
        }

        // 文本框样式
        const textareaStyle = ref(`color: #FFFFFF;
                                    font-family: Segoe UI;
                                    font-weight: Semilight;
                                    font-size: 16px;
                                    line-height: normal;
                                    letter-spacing: 0px;
                                    text-align: left;

                                    width: 100%;

                                    background-color: transparent;

                                    border: none;
                                    border-radius: 5px;

                                    box-sizing: border-box;

                                    outline: none;
                                    `);
        return {
            cellInfo,
            textareaStyle
        }
    }
}
</script>

<style scoped lang="less">
.clearfix::before,
.clearfix::after {
		content: '';
		display: table;
		clear: both;
}
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