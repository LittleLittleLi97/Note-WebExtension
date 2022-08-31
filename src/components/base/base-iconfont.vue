<template>
    <i class="iconfont" :class="icon" :style="styleText"></i>
</template>

<script>
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core';
export default {
    name: 'base-iconfont',
    props: ["icon", "size", "fontSize"],
    setup(props) {
        const styleText = ref('');
        onMounted(()=>{
            if (props.size) styleText.value += `width: ${props.size}; height: ${props.size};`;
            if (props.fontSize) styleText.value += `font-size: ${props.fontSize}`;
        })
        return {
            icon: props.icon,
            styleText,
        }
    }
}
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