<template>
    <base-menu>
        <base-menu-item
            icon="iconfont icon-add"
            title="新建..."
            v-show="type==='global'"
            @click="createCollectEvent"
        ></base-menu-item>
        <base-menu-item
            icon="iconfont icon-zhongmingming1"
            title="重命名"
            v-show="type==='folder' || type==='note'"
            @click="renameItemEvent"
        ></base-menu-item>
        
        <div class="for-note" v-show="type==='note'">
            <base-menu-item
                icon="iconfont icon-file-txt-fill"
                title="导出txt"
                @click="exportNoteEvent('txt')"
            ></base-menu-item>
            <base-menu-item
                icon="iconfont icon-file-markdown"
                title="导出md"
                @click="exportNoteEvent('md')"
            ></base-menu-item>
        </div>

        <div class="delete" v-show="type==='folder' || type==='note'">
            <base-menu-line></base-menu-line>
            <base-menu-item
                icon="iconfont icon-shanchu"
                title="删除"
                @click="deleteItemEvent"
            ></base-menu-item>
        </div>
    </base-menu>
</template>

<script>
import { computed } from '@vue/runtime-core';
import PubSub from 'pubsub-js'
import baseMenu from '@/components/base/base-menu'
import baseMenuItem from '@/components/base/base-menu-item'
import baseMenuLine from '@/components/base/base-menu-line'
export default {
    // popup收藏夹右键管理
    name: 'CollectManager',
    props: ["type"],
    emits: ["closeContextMenu", "deleteItem", "renameItem", "createItem", "exportNode"], // 先执行事件任务，再关闭contextMenu
    components: {
        baseMenu,
        baseMenuItem,
        baseMenuLine,
    },
    setup(props, context) {
        const type =  computed(()=>props.type);
        function createCollectEvent() {
            // PubSub.publish('createCollectStart');
            context.emit('createItem');
            context.emit('closeContextMenu');
        }
        function deleteItemEvent() {
            context.emit('deleteItem');
            context.emit('closeContextMenu');
        }
        function renameItemEvent() {
            context.emit('renameItem');
            context.emit('closeContextMenu');
        }
        function exportNoteEvent(type) {
            context.emit('exportNode', type);
            context.emit('closeContextMenu');
        }
        return {
            type,
            createCollectEvent,
            deleteItemEvent,
            renameItemEvent,
            exportNoteEvent,
        }
    }
}
</script>

<style scoped lang="less">

</style>