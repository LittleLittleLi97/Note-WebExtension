<template>
    <div class="note-wrapper">
        <div class="note-entry" v-show="!noteState" @click="writeNote()">
            写笔记
        </div>
        <div class="note-write" v-show="noteState">
            <div class="header">
                <div class="close-button" @click="changeState(false)">关闭</div>
            </div>
            <div class="body">
                <textarea name="" id="" class="edit-area" v-model="noteInfo.content"></textarea>
            </div>
        </div>
    </div>
    <div class="new-note-query" v-show="newNoteState">
        <div class="mask"></div>
        <div class="query-area">
            <div class="collect-handle">
                <div class="add-collect">新的收藏夹</div>
            </div>
            <ul class="collect-list">
                <li 
                    class="collect-list-item" 
                    v-for="(item, index) in collectInfo.collectListName"
                    :key="item"
                >{{ item }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core';
import { removeUrlQuery } from '@/utils/utils'
import NoteManager from '@/utils/NoteManager'
export default {
    name: 'Note',
    setup() {
        const noteManger = NoteManager.getNoteManager();

        const noteState = ref(false);
        const newNoteState = ref(true);
        const noteInfo = reactive({
            id: null,
            url: '',
            icon_url: '',
            content: '',
            collect: '',
        });
        function changeState(state) {
            noteState.value = state;
        }
        function writeNote() {
            changeState(true);
            if (!noteInfo.collect) {

            }
        }
        const collectInfo = computed(()=>noteManger.info);
        // const temp = computed(()=>1)
        onMounted(()=>{
            noteInfo.icon_url = document.querySelector("link[rel='shortcut icon']").href;
            noteInfo.url = removeUrlQuery(window.location.href);
            let storageInfo = localStorage.getItem(noteInfo.url);
            if (storageInfo) {
                let storageInfo = JSON.parse(storageInfo);
                noteInfo.content = storageInfo.content;
                noteInfo.collect = storageInfo.collect;
            }
        })
        return {
            noteState,
            changeState,
            noteInfo,
            collectInfo,
            newNoteState,
        }
    }
}
</script>

<style scoped lang="less">
.note-wrapper {
    .note-entry {
        position: fixed;
        right: 0;
        top: 50%;

        width: 50px;
        height: 50px;
        background-color: #bfa;

        border: 1px solid black;
    }
    .note-write {
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
        background-color: #c9ccd0;

        padding: 20px 0;

        box-sizing: border-box;

        .header {
            height: 50px;
        }
        .body {
            flex: 1;

            width: 100%;

            .edit-area {
                width: 80%;
                height: 200px;
            }
        }
    }
}
.new-note-query {
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 500;

        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.1);
    }
    .query-area {
        position: fixed;
        z-index: 1000;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        width: 500px;
        height: 500px;

        background-color: #fff;

        .collect-handle {
            
            .add-collect {
                font-size: 20px;
            }
        }
    }
}
</style>