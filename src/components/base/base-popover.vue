<template>
    <div class="popover-wrapper">
        <div class="popover-inner">
            <div class="content-wrapper">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
.popover-wrapper {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    .popover-inner {
        position: absolute;
        left: 50%;
        top: 50%;

        transform: translate(-50%, -100%);

        width: 300px;
        // height: 100px;

        background-color: var(--note-ext-theme2);

        .content-wrapper {
            width: 100%;
            height: 100%;

            padding: 10px;

            box-sizing: border-box;
        }
    }
}
</style>