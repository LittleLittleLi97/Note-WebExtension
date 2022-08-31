<template>
    <base-menu>
        <base-menu-item 
            icon="iconfont icon-find" 
            title="查找"
            @click="findEvent"
        ></base-menu-item>
        <base-menu-item 
            icon="iconfont icon-shanchu" 
            title="删除" 
            @click="deleteCellEvent"
        ></base-menu-item>
    </base-menu>
</template>

<script>
import baseMenu from '@/components/base/base-menu'
import baseMenuItem from '@/components/base/base-menu-item'
export default {
    name: 'NoteManager',
    emits: ['findHighlight', 'deleteCell'],
    components: {
        baseMenu,
        baseMenuItem,
    },
    setup(props, context) {
        function findEvent() {
            context.emit('findHighlight');
        }
        function deleteCellEvent() {
            context.emit('deleteCell');
        }
        return {
            findEvent,
            deleteCellEvent
        }
    }
}
</script>

<style scoped lang="less">

</style>