<template>
    <base-popover v-show="isShow">
        <div class="close-icon">
            <base-iconfont icon="icon-shanchu2" @click="closeEvent"></base-iconfont>
        </div>
        <div class="dialog-content">
            <slot></slot>
        </div>
        <div class="button-area">
            <div class="button cancel" @click="cancelEvent">{{ i18n.cancel }}</div>
            <div class="button confirm" @click="confirmEvent">{{ i18n.confirm }}</div>
        </div>
    </base-popover>
</template>

<script setup lang="ts">
import { reactive, computed, defineProps, defineEmits } from 'vue';
import basePopover from './base-popover.vue';
import baseIconfont from './base-iconfont.vue';

const i18n = reactive({
    confirm: chrome.i18n.getMessage('confirm'),
    cancel: chrome.i18n.getMessage('cancel')
});
const props = defineProps<{
    show: boolean
}>();
const emit = defineEmits(['update:show', 'cancelEvent', 'confirmEvent']);

const isShow = computed({
    get() {
        return props.show;
    },
    set(value) {
        emit('update:show', value);
    }
});
function closeEvent() {
    isShow.value = false;
}
function cancelEvent() {
    emit('cancelEvent');
    isShow.value = false;
}
function confirmEvent() {
    emit('confirmEvent');
    isShow.value = false;
}
</script>

<style scoped lang="less">
.close-icon {
    display: flex;
    justify-content: end;
}
.button-area {
    display: flex;
    justify-content: space-around;

    margin-top: 20px;

    color: var(--note-ext-font);

    .button {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100px;
        height: 28px;

        color: #fff; // 固定白色，黑色看不清
        
        background-color: var(--note-ext-blue);

        border-radius: 2px;

        cursor: pointer;
    }
}
</style>