<template>
    <base-menu>
        <base-menu-item
            icon="iconfont icon-folder-add"
            title="添加文件夹"
            v-show="type==='global'"
        ></base-menu-item>
        <base-menu-item
            icon="iconfont icon-zhongmingming1"
            title="重命名"
            v-show="type==='folder' || type==='note'"
            @click="renameFunction"
        ></base-menu-item>
        
        <div class="for-note" v-show="type==='note'">
            <base-menu-item
                icon="iconfont icon-file-txt-fill"
                title="导出txt"
                ></base-menu-item>
                <!-- @click="exportNoteEvent('txt')" -->
            <base-menu-item
                icon="iconfont icon-file-markdown"
                title="导出md"
                ></base-menu-item>
                <!-- @click="exportNoteEvent('md')" -->
        </div>

        <div class="delete" v-show="type==='folder' || type==='note'">
            <base-menu-line></base-menu-line>
            <base-menu-item
                icon="iconfont icon-shanchu"
                title="删除"
            ></base-menu-item>
        </div>
    </base-menu>
</template>

<script setup lang="ts">
// popup收藏夹右键管理
import { computed } from '@vue/runtime-core';
import { defineProps, defineEmits } from 'vue';
// import PubSub from 'pubsub-js'
import baseMenu from '@/components/base/base-menu.vue'
import baseMenuItem from '@/components/base/base-menu-item.vue'
import baseMenuLine from '@/components/base/base-menu-line.vue'

const props = defineProps<{
    type: string,
    id: string
}>();
const emit = defineEmits(["renameStart"]); // 先执行事件任务，再关闭contextMenu

const type = computed(()=>props.type)

function renameFunction() {
    emit("renameStart");
}

// const type =  computed(()=>props.type);
// function createCollectEvent() {
//     // PubSub.publish('createCollectStart');

//     emit('createItem');
//     emit('closeContextMenu');
// }
// function deleteItemEvent() {
//     emit('deleteItem');
//     emit('closeContextMenu');
// }
// function renameItemEvent() {
//     emit('renameItem');
//     emit('closeContextMenu');
// }
// function exportNoteEvent(type: any) {
//     emit('exportNode', type);
//     emit('closeContextMenu');
// }
</script>

<style scoped lang="less">

</style>