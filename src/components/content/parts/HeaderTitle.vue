<template>
    <div class="title">
        <span class="title-show" 
        >{{ noteInfo.title }}</span>
        <!-- v-show="titleState" 
        @click="changeTitleStart" -->
        <!-- <input 
            type="text" 
            class="title-input" 
            ref="titleInputBox" 
            v-model="noteInfo.title" 
            v-show="!titleState"
            @keypress.enter="changeTitleEnd" 
            @blur="changeTitleEnd"
            > -->
    </div>
</template>

<script setup lang="ts">
import { useContentStore } from '@/store/contentStore';
import { computed } from '@vue/reactivity';

const store = useContentStore();
const noteInfo = computed(()=>store.noteInfo);
</script>

<style scoped lang="less">
.title {
    font-size: 22px;
    font-weight: bold;
    text-align: left;

    margin: 0px;

    width: 256px;
    height: 36px;

    border-radius: 5px;

    overflow: hidden;

    .title-show {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        font-family: 'Segoe UI';
        font-weight: inherit;
        font-size: inherit;

        width: 100%;
        height: 100%;

        padding: 0 5px;

        box-sizing: border-box;

        transition: background-color 0.2s;

        cursor: pointer;

        &:hover {
            background-color: var(--note-ext-icon-hover);
        }
    }

    .title-input {
        font-size: inherit;
        color: inherit;
        font-family: 'Segoe UI';
        font-weight: inherit;

        width: 100%;
        height: 100%;

        background-color: transparent;

        border: none;

        outline: none;

        &:focus {
            background-color: var(--note-ext-icon-hover);
        }
    }
}
</style>