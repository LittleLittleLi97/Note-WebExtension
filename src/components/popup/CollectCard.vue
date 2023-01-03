<template>
    <a :href="noteInfo.url" target="_blank" :data-noteId="noteInfo.id" @contextmenu="openContextMenu">
        <div class="collect-card">
            <div class="web-icon"><img :src="noteInfo.url_icon" alt=""></div>
            <div class="right-info">
                <div class="title">
                    <span class="show-title" v-show="showTitleState">{{ noteInfo.title }}</span>
                    <input 
                        type="text" 
                        class="title-input"
                        ref="renameInputBox" 
                        v-show="!showTitleState" 
                        v-model="newName" 
                        @keypress.enter="renameEnd"
                        @blur="cancelRename"
                    >
                </div>
                <div class="description">{{ noteInfo.content }}</div>
            </div>
        </div>
    </a>
    <CollectManager 
        v-model="collectManagerShow" 
        type="note" 
        :id="props.noteId" 
        :location="locationStyle"
        ref="collectManagerDiv"
        @rename="renameStart"
        @delete="deleteItem"
        @download="downloadEvent"
    ></CollectManager>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, reactive, nextTick } from 'vue';
import { computed } from '@vue/reactivity';

import { usePopupStore } from '@/store/popupStore';
import CollectManager from './CollectManager.vue';
import { downloadNote } from '@/utils/utils';

const props = defineProps<{
    noteId: string
}>();
const store = usePopupStore();

const noteInfo = computed(()=>store.noteInfo[props.noteId] || {}); // info请求还没响应时为{}
onMounted(()=>{
    store.getNote(props.noteId);
})

// 右键目录部分
const collectManagerShow = ref(false);
const locationStyle = ref('');
function openContextMenu(event: MouseEvent) {
    event.preventDefault();
    locationStyle.value = `top: ${event.pageY}px; left: ${event.pageX}px;`;
    collectManagerShow.value = true;
}

// 重命名部分
const showTitleState = ref(true);
const renameInputBox = ref();
const newName = ref('');
function renameStart() {
    showTitleState.value = false;
    nextTick(()=>{
        renameInputBox.value.focus();
    })
}
function renameEnd() {
    noteInfo.value.title = newName.value;
    store.updateNote(noteInfo.value);
    cancelRename();
}
function cancelRename() {
    showTitleState.value = true;
    newName.value = '';
}

function deleteItem() {
    store.deleteNote(noteInfo.value.id);
}
function downloadEvent(type: string) {
    downloadNote(type, noteInfo.value.id);
}
</script>

<style scoped lang="less">
.collect-card {
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    color: var(--note-ext-font);

    width: 298px;
    height: 96px;

    margin-top: 10px;
    padding: 10px;

    background-color: var(--note-ext-card);

    border-radius: 5px;

    box-sizing: border-box;

    transition: all 0.2s;

    @media (prefers-color-scheme: light) {
        box-shadow: 0px 0px 2px 0px #0000003F;
        &:hover {
            box-shadow: 0px 2px 6px 0px #00000033;
            .right-info {
                .title {
                    text-decoration: underline;
                }
            }
        }
    }

    @media (prefers-color-scheme: dark) {
        box-shadow: 0px 0px 2px 0px #0000003F;
        &:hover {
            box-shadow: 0px 4px 6px 0px #0000003F;
            .right-info {
                .title {
                    text-decoration: underline;
                }
            }
        }
    }

    .web-icon {
        width: 64px;
        height: 64px;
        user-select: none;

        img {
            width: 100%;
            height: 100%;

            border-radius: 10px;
        }
    }
    .right-info {
        display: flex;
        flex-direction: column;

        width: 185px;

        margin-left: 15px;

        .title {
            font-size: 20px;
            font-family: Segoe UI;
            font-weight: semibold;
            line-height: normal;


            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            user-select: none;

            .show-title {
                text-overflow: ellipsis;
            }
            .title-input {
                font-size: inherit;
                color: inherit;

                width: 180px;

                background-color: transparent;

                border-radius: 1px;
                border: 2px solid var(--note-ext-popup-title-focus);
                outline: none;

                box-sizing: border-box;
            }
        }
        .description {
            font-size: 14px;
            color: var(--note-ext-font2);
            font-family: Microsoft YaHei;
            font-weight: regular;
            line-height: normal;

            height: 40px;
            margin-top: 5px;

            user-select: none;

            display: -webkit-box;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
        }
    }
}
</style>