<template>
    <NoteFloatBox @click="showNote" v-show="!noteState"></NoteFloatBox>
    <div class="note-area" ref="noteDiv" style="visibility: hidden;">
        <NoteMain v-show="noteState" @showNote="showNote" @closeNote="closeNote"></NoteMain>
    </div>
    <ContextHighlight @showNote="showNote"></ContextHighlight>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import NoteMain from '@/components/content/NoteMain.vue'
import NoteFloatBox from '@/components/content/NoteFloatBox.vue'
import ContextHighlight from '@/components/content/ContextHighlight.vue'
const noteState = ref(true); // false → NoteFloatBox, true → Note
const noteDiv = ref();
function showNote() {
    noteState.value = true;
}
function closeNote() {
    noteState.value = false;
}
provide('showControl', {showNote, closeNote});
// 组件bug，textarea必须在mount时show，否则之后show时高度没有自适应
// 这里设置show并visibility: hidden;隐藏显示，mount后关闭
// 在Note关闭动画结束后，去掉visibility: hidden;
onMounted(()=>{
    closeNote();
    setTimeout(() => {
        noteDiv.value.style.cssText = '';
    }, 500);
})
</script>

<style>

</style>