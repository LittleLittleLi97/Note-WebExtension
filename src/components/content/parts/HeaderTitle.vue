<template>
    <div class="title">
        <baseChangeableSpan v-model="noteInfo.title"></baseChangeableSpan>
    </div>
</template>

<script setup lang="ts">
import { useContentStore } from '@/store/contentStore';
import { computed } from '@vue/reactivity';
import { ref, watch } from 'vue';

import baseChangeableSpan from '@/components/base/base-changeable-span.vue';

const store = useContentStore();
const noteInfo = computed(()=>store.noteInfo);

watch(()=>noteInfo.value.title, ()=>{
    store.saveNote();
})
</script>

<style scoped lang="less">
.title {
    font-size: 22px;
    font-weight: bold;
    text-align: left;

    margin: 0px;

    width: 256px;
    height: 36px;

    border-radius: 5px;

    overflow: hidden;
}
</style>