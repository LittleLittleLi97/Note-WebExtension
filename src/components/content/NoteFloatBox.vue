<template>
    <div class="note-float-box">
        <i class="iconfont icon-bijinotes23"></i>
        <span class="write-note">{{ i18n.write_notes }}</span>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
const i18n = reactive({
    write_notes: chrome.i18n.getMessage('write_notes')
})
</script>

<style scoped lang="less">
.note-float-box {
    position: fixed;
    top: 50%;
    right: 60px;
    z-index: 9999;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 80px;
    height: 80px;

    padding: 10px;

    background-color: var(--note-ext-theme);

    border-radius: 50%;

    box-shadow: 0px 1px 8px 0px #00000033;

    box-sizing: border-box;

    cursor: pointer;

    transition: background-color 0.2s;

    &:hover {
        background-color: var(--note-ext-icon-hover);
    }

    .iconfont {
        font-size: 20px;
        color: var(--note-ext-font);
    }
    .write-note {
        font-size: 16px;
        font-family: Segoe UI;
        color: var(--note-ext-font);
    }
}
</style>