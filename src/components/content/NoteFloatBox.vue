<template>
    <div class="note-float-box">
        <i class="iconfont icon-bijinotes23"></i>
        <span class="write-note">写笔记</span>
    </div>
</template>

<script setup lang="ts">

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