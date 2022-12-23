<template>
    <div class="folder-section">
        <div 
            class="title" 
            @click="changeFolderState" 
            @contextmenu="openContextMenu"
            :data-collectId="collectInfo.id"
        >
            <i class="iconfont icon-tri-right-bottom-copy icon-default" :class="{'icon-rotate': !folderState.collectCardShow}"></i>
            <span class="show-title" v-show="showTitleState">{{ collectInfo.name }}</span>
            <input 
                type="text" 
                class="title-input"
                ref="renameInputBox" 
                v-show="!showTitleState" 
                v-model="newName" 
                @keypress.enter="renameEnd"
                @blur="cancelRename"
            >
        </div>
        <div class="card-area" v-show="folderState.collectCardShow">
            <CollectCard 
                v-for="item in collectInfo.children" 
                :key="item" 
                :noteId="item"
            />
        </div>
    </div>
    <CollectManager 
        v-model="collectManagerShow" 
        type="folder" 
        :id="collectInfo.id" 
        :location="locationStyle"
        ref="collectManagerDiv"
        @rename="renameStart"
        @delete="deleteItem"
    ></CollectManager>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, reactive, nextTick } from 'vue';
import CollectCard from '@/components/popup/CollectCard.vue'
import CollectManager from './CollectManager.vue';
import { collect, collectList } from '@/utils/interface';
import { usePopupStore } from '@/store/popupStore';

const store = usePopupStore();
const props = defineProps<{
    collectInfo: collect
}>();
const collectInfo = computed(()=>props.collectInfo);

const folderState = reactive({
    collectCardShow: false,
    iconfontClass: 'icon-tri-right'
});
function changeFolderState() { // 收藏夹更改折叠状态，！此处代码貌似该删除了
    folderState.iconfontClass = folderState.collectCardShow ? 'icon-tri-right' : 'icon-tri-right-bottom-copy';
    folderState.collectCardShow = !folderState.collectCardShow;
}

// 右键目录管理
const collectManagerShow = ref(false);
const locationStyle = ref('');
function openContextMenu(event: MouseEvent) {
    event.preventDefault();
    locationStyle.value = `top: ${event.pageY}px; left: ${event.pageX}px;`;
    collectManagerShow.value = true;
}

// 重命名部分
const showTitleState = ref(true);
const renameInputBox = ref();
const newName = ref('');
function renameStart() {
    showTitleState.value = false;
    nextTick(()=>{
        renameInputBox.value.focus();
    })
}
function renameEnd() {
    collectInfo.value.name = newName.value;
    store.updateCollect(collectInfo.value);
    cancelRename();
}
function cancelRename() {
    showTitleState.value = true;
    newName.value = '';
}

function deleteItem() {
    store.deleteCollect(collectInfo.value.id);
}
</script>

<style scoped lang="less">
    .folder-section {
        color: var(--note-ext-font);

        .title {
            font-size: 16px;
            font-family: Segoe UI;
            font-weight: regular;
            line-height: normal;
            letter-spacing: 0px;
            text-align: left;

            padding: 5px 12px;

            height: 32px;
            
            border-radius: 1px;

            box-sizing: border-box;

            cursor: pointer;

            transition: background-color 0.2s;

            &:hover {
                background-color: var(--note-ext-popup-title-hover);
            }

            .iconfont {
                margin-right: 5px;
            }

            .title-input {
                font-size: 15px;
                color: inherit;

                width: 270px;

                background-color: transparent;

                border-radius: 1px;
                border: 2px solid var(--note-ext-popup-title-focus);
                outline: none;

                box-sizing: border-box;
            }
            .show-title {
                user-select: none;
            }
            .icon-rotate {        
                transform: rotate(-45deg);
            }
            .icon-default {
                display: inline-block;
                transition: all 0.2s;
            }
        }

        .card-area {
            display: grid;
            // grid-gap: 10px;

            // margin-top: 10px;
            padding: 0 11px;

            box-sizing: border-box;
        }
    }
</style>