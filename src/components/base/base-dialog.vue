<template>
    <div class="dialog-wrapper">
        <div class="dialog-inner">
            <div class="content-wrapper">
                <div class="text">{{ text }}</div>
                <div class="button-area">
                    <div class="cancel" @click="cancelEvent">取消</div>
                    <div class="confirm" @click="confirmEvent">确认</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'base-dialog',
    props: ["text"],
    emits: ["cancelFunction", "confirmFunction"],
    setup(props, context) {
        function cancelEvent() {
            context.emit('cancelFunction');
        }
        function confirmEvent() {
            context.emit('confirmFunction');
        }
        return {
            text: props.text,
            cancelEvent,
            confirmEvent,
        }
    }
}
</script>

<style scoped lang="less">
.dialog-wrapper {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    // background-color: #fff;

    .dialog-inner {
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