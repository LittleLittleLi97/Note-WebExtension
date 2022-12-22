<template>
    <div class="base-changeable-span">
        <span
            v-show="!changeInfo.state"
            @click="changeStart"
        >{{ props.modelValue }}</span>
        <input 
            type="text" 
            ref="inputBox" 
            v-model="changeInfo.value" 
            v-show="changeInfo.state"
            @keypress.enter="changeEnd" 
            @blur="changeEnd"
        >
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, ref, nextTick } from 'vue';

const props = defineProps<{
    modelValue: string
}>();
const emit = defineEmits(["update:modelValue"]);

const changeInfo = reactive({
    value: '',
    state: false
});
const inputBox = ref();
function changeStart() {
    changeInfo.state = true;
    nextTick(()=>{
        inputBox.value.focus();
    })
}
function changeEnd() {
    if (changeInfo.state) { // 避免enter和blur两次触发
        if (changeInfo.value.length > 0) emit('update:modelValue', changeInfo.value);
        changeInfo.state = false;
        changeInfo.value = '';
    }
}
</script>

<style scoped lang="less">
.base-changeable-span {

    width: 100%;
    height: 100%;

    span {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    
        font-family: 'Segoe UI';
        font-weight: inherit;
        font-size: inherit;
    
        width: 100%;
        height: 100%;
    
        padding: 0 5px;
    
        box-sizing: border-box;
    
        transition: background-color 0.2s;
    
        cursor: pointer;
    
        &:hover {
            background-color: var(--note-ext-icon-hover);
        }
    }
    
    input {
        font-size: inherit;
        color: inherit;
        font-family: 'Segoe UI';
        font-weight: inherit;
    
        width: 100%;
        height: 100%;
    
        background-color: transparent;
    
        border: none;
    
        outline: none;
    
        &:focus {
            background-color: var(--note-ext-icon-hover);
        }
    }
}
</style>