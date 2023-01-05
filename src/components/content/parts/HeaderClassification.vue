<template>
    <div class="classification-area">
        <i class="iconfont icon-shoucang"></i>
        <select class="classification"
            v-model="noteInfo.collect_id"
            v-show="collectState"
            >
            <option 
                v-for="item in collectList"
                :key="item.id"
                :selected="noteInfo.collect_id==item.id"
                :value="item.id"
            >{{ item.name }}</option>
            <option>{{ createCollectButton }}</option>
        </select>
        <input type="text"
            class="collect-input"
            ref="collectInputBox"
            v-show="!collectState"
            @keypress.enter="createCollectEnd"
            @blur="createCollectEnd"
        >
    </div>
</template>

<script setup lang="ts">
import { useContentStore } from '@/store/contentStore';
import { computed, ref, watch, nextTick } from 'vue';

const store = useContentStore();
const noteInfo = computed(()=>store.noteInfo);
const collectList = computed(()=>store.collectList);

const createCollectButton = ref(chrome.i18n.getMessage('create'));
const collectState = ref(true);
const collectInputBox = ref();
let lastCollectId = noteInfo.value.collect_id;
watch(()=>noteInfo.value.collect_id, (newValue, oldValue)=>{
    console.log('watch: ', newValue, oldValue)
    if (!newValue || !oldValue) return;
    if (oldValue === createCollectButton.value) return; // 新建收藏夹的结束阶段
    if (newValue === createCollectButton.value) { // 开始新建收藏夹
        collectState.value = false;
        lastCollectId = oldValue;
        nextTick(()=>collectInputBox.value.focus());
        return;
    }
    store.changeCollect(newValue, oldValue); // 直接更改收藏夹
})
function createCollectEnd() {
    if (collectState.value === false) {
        const name = collectInputBox.value.value;
        store.newCollect(name, noteInfo.value.id, lastCollectId);
        collectState.value = true;
    }
}
</script>

<style scoped lang="less">
.classification-area {
    display: inline-flex; // 宽度自适应，不占整行
    justify-content: center;
    align-items: center;

    padding: 2px 5px;

    border-radius: 5px;

    box-sizing: border-box;

    transition: background-color 0.2s;

    cursor: pointer;

    &:hover {
        background-color: var(--note-ext-icon-hover);
    }

    &:focus {
        background-color: var(--note-ext-icon-hover);
    }

    .iconfont {
        font-size: 20px;
    }
    .classification {
        font-size: 16px;
        color: var(--note-ext-font);
        font-family: Segoe UI;
        font-weight: Semilight;
        line-height: normal;
        letter-spacing: 0px;
        text-align: left;

        width: 100px;

        margin: 0px 0px 0px 10px;

        background-color: transparent;

        border: none;

        outline: none;

        cursor: pointer;

        -webkit-appearance: none;

        option {
            color: var(--note-ext-font);
            background-color: var(--note-ext-theme2);
        }
    }
    .collect-input {
        color: inherit;

        width: 100px;

        margin-left: 10px;

        background-color: transparent;

        border: none;
        outline: none;
    }
}
</style>