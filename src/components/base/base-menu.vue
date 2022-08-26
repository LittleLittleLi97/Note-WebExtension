<template>
    <div class="collect-manager">
        <ul class="option-list">
            <slot></slot>
            <!-- <div class="divding-line"></div> -->
        </ul>
    </div>
</template>

<script>
export default {
    name: 'base-menu',
}
</script>

<style scoped lang="less">
    .collect-manager {
        color: var(--note-ext-font);

        // width: 216px;
        width: 120px;

        background-color: var(--note-ext-theme);

        border-radius: 4px;
        
        box-shadow: 0px 4px 12px 0px #00000066,0px 0px 2px 0px #0000003F;

        box-sizing: border-box;

        .option-list {
            padding: 4px;

            box-sizing: border-box;

        }
        .dividing-line {
            width: 100%;
            border-top: 1px solid var(--note-ext-line);
        }
    }
</style>