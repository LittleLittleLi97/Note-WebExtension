<template>
    <div class="cell-card">
        <div class="label" style="background-color: var(--note-ext-blue);"></div>
        <div class="cell-right">
            <div class="content">
                文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CellCard',
}
</script>

<style scoped lang="less">
.cell-card {
    display: flex;

    color: var(--note-ext-font);

    width: 100%;

    padding: 10px;

    background-color: var(--note-ext-card);

    box-sizing: border-box;

    .label {
        width: 16px;
        height: 16px;
        
        margin-top: 2px;

        border-radius: 50%;
    }
    .cell-right {
        flex: 1;

        font-size: 16px;
        line-height: normal;

        margin-left: 10px;
    }
}
</style>