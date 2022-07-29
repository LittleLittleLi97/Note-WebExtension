<template>
    <div class="note-wrapper">
        <div class="note-header">
            <div class="title">本页笔记</div>
            <div class="more">
                <div>···</div>
                <div>X</div>
            </div>
        </div>
        <div class="cell-area">
            <CellCard></CellCard>
            <CellCard></CellCard>
            <CellCard></CellCard>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core';
import { removeUrlQuery } from '@/utils/utils'
import NoteManager from '@/utils/NoteManager'
import CellCard from '@/components/CellCard'
export default {
    name: 'Note',
    components: {
        CellCard
    }
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

    color: var(--note-ext-font);

    width: 400px;
    height: 100%;
    background-color: var(--note-ext-theme2);

    border: 1px solid var(--note-ext-border);

    box-sizing: border-box;

    .note-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        width: 100%;
        height: 56px;

        padding: 14px 16px;

        border-bottom: 1px solid var(--note-ext-line);

        box-sizing: border-box;

        .title {
            font-size: 22px;
            font-weight: bold;
        }
        .more {
            display: flex;
            align-items: center;

            font-size: 20px;
        }
    }
    .cell-area {
        display: grid;
        grid-gap: 10px;

        padding: 10px 20px;

        overflow-y: scroll;
        scroll-behavior: auto;
    }
}
</style>