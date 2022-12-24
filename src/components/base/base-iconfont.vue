<template>
    <i class="iconfont" :class="icon" :style="styleText"></i>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'

const props = defineProps<{
    icon: string,
    size?: string,
    fontSize?: string
}>();
const styleText = ref('');
onMounted(()=>{
    if (props.size) styleText.value += `width: ${props.size}; height: ${props.size};`;
    if (props.fontSize) styleText.value += `font-size: ${props.fontSize}`;
})
</script>

<style scoped lang="less">
.iconfont {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 22px;
    color: var(--note-ext-font);

    width: 30px;
    height: 30px;

    border-radius: 5px;

    cursor: pointer;

    transition: background-color 0.2s;

    &:hover {
        background-color: var(--note-ext-icon-hover);
    }
}
</style>