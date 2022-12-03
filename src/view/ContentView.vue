<template>
    <NoteFloatBox @click="showNote" v-show="!noteState"></NoteFloatBox>
    <div class="note-area" ref="noteDiv" style="visibility: hidden;">
        <NoteMain v-show="noteState" @showNote="showNote" @closeNote="closeNote"></NoteMain>
    </div>
    <!-- <ContextFloatBox @showNote="showNote"></ContextFloatBox> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NoteMain from '@/components/content/NoteMain.vue'
import NoteFloatBox from '@/components/content/NoteFloatBox.vue'
// import ContextFloatBox from '@/components/content/ContextFloatBox'
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
        // noteDiv.value.style.cssText = '';
    }, 500);
})
</script>

<style>

</style>