<!-- 样式需要改 更改base-dialog中的 -->
<template>
    <base-dialog 
        v-model:show="isShow"
        @cancelEvent="cancelEvent"
        @confirmEvent="confirmEvent"
    >
        <input 
            type="text" 
            placeholder="请输入收藏夹名称..." 
            class="input-box" 
            ref="inputBox"
            v-model="collectName"
        >
    </base-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, defineProps, defineEmits } from 'vue';
import { usePopupStore } from '@/store/popupStore';
import baseDialog from '../base/base-dialog.vue';

const store = usePopupStore();
const props = defineProps<{
    show: boolean
}>();
const emit = defineEmits(['update:show']);

const isShow = computed({
    get() {
        return props.show;
    },
    set(value) {
        emit('update:show', value);
    }
});

const inputBox = ref();
watch(()=>isShow.value, (newValue)=>{
    if (newValue === true) {
        nextTick(()=>inputBox.value.focus());
    }
})

const collectName = ref('');
function cancelEvent() {
    collectName.value = '';
}
function confirmEvent() {
    const name = collectName.value.trim();
    if (name.length > 0) {
        store.createCollect(name);
    }
}
</script>

<style scoped lang="less">
.input-box {
    width: 100%;

    box-sizing: border-box;
}
</style>