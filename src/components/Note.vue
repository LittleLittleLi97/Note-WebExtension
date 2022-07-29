<template>
    <div class="note-wrapper">

    </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core';
import { removeUrlQuery } from '@/utils/utils'
import NoteManager from '@/utils/NoteManager'
export default {
    name: 'Note',
    // setup() {
    //     const noteManger = NoteManager.getNoteManager();

    //     const noteState = ref(false);
    //     const newNoteState = ref(true);
    //     const noteInfo = reactive({
    //         id: null,
    //         url: '',
    //         icon_url: '',
    //         content: '',
    //         collect: '',
    //     });
    //     function changeState(state) {
    //         noteState.value = state;
    //     }
    //     function writeNote() {
    //         changeState(true);
    //         if (!noteInfo.collect) {

    //         }
    //     }
    //     const collectInfo = computed(()=>noteManger.info);
    //     // const temp = computed(()=>1)
    //     onMounted(()=>{
    //         noteInfo.icon_url = document.querySelector("link[rel='shortcut icon']").href;
    //         noteInfo.url = removeUrlQuery(window.location.href);
    //         let storageInfo = localStorage.getItem(noteInfo.url);
    //         if (storageInfo) {
    //             let storageInfo = JSON.parse(storageInfo);
    //             noteInfo.content = storageInfo.content;
    //             noteInfo.collect = storageInfo.collect;
    //         }
    //     })
    //     return {
    //         noteState,
    //         changeState,
    //         noteInfo,
    //         collectInfo,
    //         newNoteState,
    //     }
    // }
}
</script>

<style scoped lang="less">
.note-wrapper {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 9999;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 300px;
    height: 100%;
    background-color: var(--note-ext-theme);

    padding: 20px 0;

    box-sizing: border-box;
}
</style>