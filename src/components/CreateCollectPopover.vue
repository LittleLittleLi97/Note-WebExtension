<template>
    <div class="popover-wrapper">
        <div class="popover-inner">
            <div class="content-wrapper">
                <input type="text" placeholder="请输入收藏夹名称..." class="input-box">
                <div class="button-area">
                    <div class="cancel">取消</div>
                    <div class="confirm">确认</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CreateCollectPopover',
}
</script>

<style scoped lang="less">
.popover-wrapper {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    // background-color: #fff;

    .popover-inner {
        position: absolute;
        left: 50%;
        top: 50%;

        transform: translate(-50%, -100%);

        width: 300px;
        height: 100px;


        background-color: var(--note-ext-theme2);

        .content-wrapper {
            width: 100%;
            height: 100%;

            padding: 15px 30px;

            box-sizing: border-box;

            .input-box {
                width: 100%;

                box-sizing: border-box;
            }
            .button-area {
                color: var(--note-ext-font);
            }
        }
    }
}
</style>