<template>
    <base-dialog v-model:show="isShow" @cancel-event="cancelEvent" @confirm-event="confirmEvent">
        <span class="tip-text">
            {{ text }}
        </span>
    </base-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import PubSub from 'pubsub-js'
import baseDialog from '../base/base-dialog.vue';

const i18n = reactive({
    text: chrome.i18n.getMessage('delete_corresponding_query')
});
const isShow = ref(false);
const text = ref('');

function cancelEvent() {
    PubSub.publish('deleteEndEmit', false);
}
function confirmEvent() {
    PubSub.publish('deleteEndEmit', true);
}

onMounted(()=>{
    PubSub.subscribe('deleteStartEmit', (msg, type: string)=>{
        text.value = i18n.text.replace('...', type);
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