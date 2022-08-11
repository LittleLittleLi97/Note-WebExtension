<template>
    <NoteFloatBox @click="showNote" v-show="!noteState"></NoteFloatBox>
    <div class="note-area" ref="noteDiv" style="visibility: hidden;">
        <Note v-show="noteState" @closeNote="closeNote"></Note>
    </div>
    <!-- <ContextFloatBox @showNote="showNote"></ContextFloatBox> -->
</template>

<script>
import { onMounted, ref } from 'vue'
import Note from '@/components/Note'
import NoteFloatBox from '@/components/NoteFloatBox'
import ContextFloatBox from '@/components/ContextFloatBox'
export default {
    name: 'contentView',
    components: {
        Note,
        NoteFloatBox,
        ContextFloatBox
    },
    setup() {
        const noteState = ref(true); // false → NoteFloatBox, true → Note
        const noteDiv = ref(null);
        function showNote() {
            noteState.value = true;
        }
        function closeNote() {
            noteState.value = false;
        }
        // 组件bug，textarea必须在mount时show，否则之后show时高度没有自适应
        // 这里设置show并visibility: hidden;隐藏显示，mount后关闭
        // 在Note关闭动画结束后，去掉visibility: hidden;
        onMounted(()=>{
            closeNote();
            setTimeout(() => {
                noteDiv.value.style.cssText = '';
            }, 500);
        })
        return {
            noteState,
            noteDiv,
            showNote,
            closeNote
        }
    }
}
</script>

<style>

</style>