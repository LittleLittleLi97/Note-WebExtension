<template>
    <div class="dialog-wrapper">
        <div class="dialog-inner">
            <div class="content-wrapper">
                <div class="close-icon">
                    <!-- <i class="iconfont icon-shanchu2" @click="closeEvent"></i> -->
                    <base-iconfont icon="icon-shanchu2" @click="closeEvent"></base-iconfont>
                </div>
                <div class="text">{{ text }}</div>
                <div class="button-area">
                    <div class="button cancel" @click="cancelEvent">取消</div>
                    <div class="button confirm" @click="confirmEvent">确认</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import baseIconfont from '@/components/base/base-iconfont'
export default {
    name: 'base-dialog',
    props: ["text"],
    emits: ["closeFunction", "cancelFunction", "confirmFunction"],
    components: {
        baseIconfont,
    },
    setup(props, context) {
        function closeEvent() {
            context.emit('closeFunction')
        }
        function cancelEvent() {
            context.emit('cancelFunction');
        }
        function confirmEvent() {
            context.emit('confirmFunction');
        }
        return {
            text: props.text,
            closeEvent,
            cancelEvent,
            confirmEvent,
        }
    }
}
</script>

<style scoped lang="less">
.dialog-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10001;

    width: 100%;
    height: 100%;

    background-color: var(--note-ext-mask-background);

    .dialog-inner {
        position: fixed;
        left: 50%;
        top: 50%;

        transform: translate(-50%, -100%);

        width: 300px;
        // height: 120px;


        background-color: var(--note-ext-theme2);

        border-radius: 4px;

        .content-wrapper {
            width: 100%;
            height: 100%;

            padding: 15px 30px;

            box-sizing: border-box;

            // display: flex;
            // align-content: space-around;
            // justify-content: space-between;
            // flex-direction: column;

            .close-icon {
                display: flex;
                justify-content: end;
            }

            .text {
                color: var(--note-ext-font);

                margin-left: 12px;
            }

            .button-area {
                display: flex;
                justify-content: space-around;

                margin-top: 20px;

                color: var(--note-ext-font);

                .button {
                    background-color: var(--note-ext-blue);
                    width: 100px;
                    height: 28px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 2px;
                    color: #fff; // 固定白色，黑色看不清

                    cursor: pointer;
                }
            }
        }
    }
}
</style>