<template>
    <div class="float-box" v-show="boxState" ref="floatBoxDiv" @click="addNote">添加笔记</div>
</template>

<script>
import { onMounted, reactive, ref } from '@vue/runtime-core'
export default {
    name: 'FloatBox',
    setup() {
        const boxState = ref(false);
        const floatBoxDiv = ref(null);
        const selectText = reactive({
            lastText: '',
            nowText: '',
            target: null,
            selection: null,
        });
        onMounted(()=>{
            document.addEventListener('mouseup', (event)=>{
                selectText.nowText = window.getSelection().toString();

                if (selectText.nowText && selectText.nowText != selectText.lastText) {
                    floatBoxDiv.value.style.cssText = `top: ${event.clientY}px; left: ${event.clientX}px;`;
                    boxState.value = true;
                } else {
                    boxState.value = false;
                }

                selectText.lastText = selectText.nowText;
                selectText.target = event.target;
                selectText.selection = window.getSelection();
            })
        });
        function addNote() {
            console.log(selectText.target);
            console.log(selectText.selection);
        }
        return {
            boxState,
            floatBoxDiv,
            addNote,
        }
    }
}
</script>

<style scoped lang="less">
.float-box {
    position: absolute;
    z-index: 9999;

    font-size: 16px;

    width: 100px;
    height: 30px;

    border: 1px solid black;
}
</style>