<template>
    <base-dialog v-model:show="isShow" @cancel-event="cancelEvent" @confirm-event="confirmEvent">
        <span class="tip-text">
            是否删除对应的{{ deleteType }}部分？
        </span>
    </base-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PubSub from 'pubsub-js'
import baseDialog from '../base/base-dialog.vue';

const isShow = ref(false);
const deleteType = ref('');

function cancelEvent() {
    PubSub.publish('deleteEndEmit', false);
}
function confirmEvent() {
    PubSub.publish('deleteEndEmit', true);
}

onMounted(()=>{
    PubSub.subscribe('deleteStartEmit', (msg, type: string)=>{
        deleteType.value = type;
        isShow.value = true;
    });
})
</script>

<style scoped lang="less">
.tip-text {
    font-size: inherit;
    color: var(--note-ext-font);

    background-color: inherit;
}
</style>