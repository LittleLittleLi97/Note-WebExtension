<template>
    <div class="collect-manager" v-show="isShow" @click="(isShow=!isShow)" :style="props.location">
        <base-menu>
            <base-menu-item 
                icon="iconfont icon-find" 
                :title="i18n.find"
                v-show="type === 'highlight'"
                @click="findEvent"
            ></base-menu-item>
            <base-menu-item 
                icon="iconfont icon-shanchu" 
                :title="i18n.delete" 
                @click="deleteCellEvent"
            ></base-menu-item>
        </base-menu>
        <div class="mask"></div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from '@vue/runtime-core';
import { defineProps, defineEmits } from 'vue';
import baseMenu from '@/components/base/base-menu.vue'
import baseMenuItem from '@/components/base/base-menu-item.vue'

const i18n = reactive({
    find: chrome.i18n.getMessage('find'),
    delete: chrome.i18n.getMessage('delete')
});
const props = defineProps<{
    modelValue: boolean,
    type: string,
    location?: string
}>();
const emit = defineEmits(["update:modelValue", 'findHighlight', 'deleteCell']);

const isShow = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    }
})
const type = computed(()=>props.type);

function findEvent() {
    emit('findHighlight');
}
function deleteCellEvent() {
    emit('deleteCell');
}
</script>

<style scoped lang="less">
.collect-manager {
    position: absolute;
    z-index: 100;

    .mask {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;

        width: 100%;
        height: 100%;

        // background-color: black;
    }
}
</style>