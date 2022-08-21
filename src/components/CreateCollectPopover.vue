<template>
    <div class="popover-wrapper" v-show="isShow">
        <div class="popover-inner">
            <div class="content-wrapper">
                <input type="text" placeholder="请输入收藏夹名称..." class="input-box" v-model="collectName">
                <div class="button-area">
                    <div class="cancel" @click="cancelCreate">取消</div>
                    <div class="confirm" @click="createCollectEnd">确认</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import PubSub from 'pubsub-js'
export default {
    name: 'CreateCollectPopover',
    setup() {
        const isShow = ref(false);
        const collectName = ref('');
        function cancelCreate() {
            isShow.value = false;
            collectName.value = '';
        }
        function createCollectEnd() {
            if (collectName.value.trim() !== '') PubSub.publish('createCollectEnd', collectName.value);
            cancelCreate();
        }
        onMounted(()=>{
            PubSub.subscribe('createCollectStart', ()=>{
                isShow.value = true;
            })
        })
        return {
            isShow,
            collectName,
            cancelCreate,
            createCollectEnd,
        }
    }
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