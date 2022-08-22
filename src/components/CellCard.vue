<template>
    <div class="cell-card" :data-cellId="cellInfo.id">
        <div class="label-area" ref="labelListBox">
            <div 
                class="label" 
                :style="`background-color: var(--note-ext-${cellInfo.label});`"
                @click="changeLabelStart"
            ></div>
            <ul class="label-list" v-show="labelListShow">
                <li 
                    class="label label-item" 
                    v-for="(color, index) in labelList" 
                    :style="`background-color: var(--note-ext-${color});`"
                    @click="changeLabelEnd(color)"
                ></li>
            </ul>
        </div>
        <div class="cell-right">
            <el-input
                v-model="cellInfo.content"
                autosize
                type="textarea"
                placeholder="Please input"
                :input-style="textareaStyle"
                resize="none"
                ref="textareaDiv"
                v-show="!mdShow"
                @blur="compileToMd"
            />
            <!-- markdown的样式被reset设置，在root.css中将其覆盖 -->
            <div class="note-ext-md-box" ref="mdDiv" v-show="mdShow" @click="focusTextarea"></div>
        </div>
    </div>
</template>

<script>
import { computed, nextTick, onMounted, reactive, ref, watch } from '@vue/runtime-core'
import { copyObjToReactive, parseReactiveToObj } from '@/utils/utils';
import { ElInput } from 'element-plus'
import { marked } from 'marked'
import hljs from 'highlight.js'
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
                    compileToMd(); // 初始化markdown
                }
            });
        })

        // 保存信息
        watch(()=>cellInfo.content, saveCellInfo);
        let timer = null;
        function saveCellInfo() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                chrome.runtime.sendMessage({func: 'save', type: 'cell', data: cellInfo});
                context.emit('saveNote', { // 更新Note信息
                    newContent: cellInfo.content.slice(0, 30)
                });
                console.log('保存成功')
            }, 1000);
        }

        // 文本框样式
        const textareaStyle = ref(`color: var(--note-ext-font);
                                    font-family: Segoe UI;
                                    font-weight: Semilight;
                                    font-size: 16px;
                                    line-height: normal;
                                    letter-spacing: 0px;
                                    text-align: left;

                                    width: 100%;

                                    padding: 0px;

                                    background-color: transparent;

                                    border: none;
                                    border-radius: 5px;

                                    box-sizing: border-box;

                                    outline: none;
                                    `);

        // label列表
        function labelFunction() {
            const labelList = reactive(['blue', 'yellow', 'red', 'green', 'purple']);
            const labelListShow = ref(false);
            const labelListBox = ref(null);
            function changeLabelStart() {
                labelListShow.value = true;
                document.addEventListener('click', cancelChangeLabel);
            }
            function changeLabelEnd(color) {
                cellInfo.label = color;
                labelListShow.value = false;
                document.removeEventListener('click', cancelChangeLabel);
                chrome.runtime.sendMessage({func: 'save', type: 'cell', data: cellInfo});
            }
            function cancelChangeLabel(event) {
                if (!labelListBox.value.contains(event.target)) {
                    labelListShow.value = false;
                    document.removeEventListener('click', cancelChangeLabel);
                }
            }
            return {
                labelList,
                labelListShow,
                labelListBox,
                changeLabelStart,
                changeLabelEnd,
            }
        }

        // markdown
        const textareaDiv = ref(null);
        const mdDiv = ref(null);
        const mdShow = ref(true);
        function focusTextarea() {
            mdShow.value = false;
            textareaDiv.value.focus();
        }
        function compileToMd() {
            mdShow.value = true;
            mdDiv.value.innerHTML = marked.parse(cellInfo.content);
        }
        marked.setOptions({
            highlight: function(code) {
                return hljs.highlightAuto(code).value;
            },
            langPrefix: 'hljs language-',
            breaks: true,
        })
        return {
            cellInfo,
            textareaStyle,
            ...labelFunction(),
            mdDiv,
            textareaDiv,
            focusTextarea,
            textareaDiv,
            mdShow,
            compileToMd,
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

    box-shadow: 0px 0px 2px 0px #0000003F;

    box-sizing: border-box;

    .label-area {
        position: relative;

        margin: 3.5px 10px 0 10px;

        box-sizing: border-box;

        .label {
            width: 16px;
            height: 16px;

            border-radius: 50%;

            cursor: pointer;
        }
        .label-list {
            position: absolute;
            top: 100%;
            left: 50%;
            z-index: 10001;

            display: flex;

            transform: translateX(-50%);

            .label-item {
                margin: 1px;

                box-sizing: border-box;
            }
        }
    }
    .cell-right {
        flex: 1;
        
        // width: 100%;

        font-size: 16px;
        line-height: normal;

        margin-left: 10px;

        .note-ext-md-box {
            min-height: 22px;
        }
    }
}

textarea {
    &::-webkit-scrollbar {
        display: none;
    }
}
</style>