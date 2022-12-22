<template>
    <div class="cell-card">
        <div class="label-area" ref="labelListBox">
            <div 
                class="label" 
            ></div>
                <!-- :style="`background-color: var(--note-ext-${cellInfo.label});`"
                @click="changeLabelStart" -->
            <!-- <ul class="label-list" v-show="labelListShow">
                <li 
                    class="label label-item" 
                    v-for="color in labelList" 
                    :style="`background-color: var(--note-ext-${color});`"
                    @click="changeLabelEnd(color)"
                    ></li>
            </ul> -->
        </div>
        <div class="cell-right">
            <el-input
                type="textarea"
                autosize
                placeholder="Please input"
                :input-style="textareaStyle"
                resize="none"
                v-model="cellInfo.content"
                ref="textareaDiv"
                />
            <!-- v-show="!mdShow"
            @blur="compileToMd" -->
            <!-- markdown的样式被reset设置，在root.css中将其覆盖 -->
            <!-- <div class="note-ext-md-box" ref="mdDiv" v-show="mdShow" @click="focusTextarea"></div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineProps, watch, onMounted } from 'vue';
import { cell } from '@/utils/interface';
import { useContentStore } from '@/store/contentStore';
import { ElInput } from 'element-plus';

const props = defineProps<{
    cellId: string
}>();

const store = useContentStore();
const cellInfo = computed(()=>store.cellList[props.cellId] || {});
// const cellInfo = reactive(store.cellList[props.cellId]);

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

let timer = 0;
watch(()=>cellInfo.value.content, ()=>{
    clearTimeout(timer);
    timer = setTimeout(() => {
        store.saveCell(props.cellId);
    }, 1000);
});
</script>

<style scoped lang="less">
.cell-card {
    display: flex;

    color: var(--note-ext-font);

    width: 100%;

    min-height: 56px;

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
            top: 22px;
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