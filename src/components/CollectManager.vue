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
            v-show="type==='local'"
            @click="renameItemEvent"
        ></base-menu-item>
        <base-menu-item
            icon="iconfont icon-shanchu"
            title="删除"
            v-show="type==='local'"
            @click="deleteItemEvent"
        ></base-menu-item>
    </base-menu>
</template>

<script>
import { computed } from '@vue/runtime-core';
import PubSub from 'pubsub-js'
import baseMenu from '@/components/base/base-menu'
import baseMenuItem from '@/components/base/base-menu-item'
export default {
    // popup收藏夹右键管理
    name: 'CollectManager',
    props: ["type"],
    emits: ["closeContextMenu", "deleteItem", "renameItem", "createItem"], // 先执行事件任务，再关闭contextMenu
    components: {
        baseMenu,
        baseMenuItem,
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
        return {
            type,
            createCollectEvent,
            deleteItemEvent,
            renameItemEvent,
        }
    }
}
</script>

<style scoped lang="less">

</style>