<template>
    <base-menu>
        <base-menu-item 
            icon="iconfont icon-find" 
            title="查找"
            v-show="isFindShow"
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
import { computed, ref, watch } from '@vue/runtime-core'
export default {
    name: 'NoteManager',
    props: ['cellId'],
    emits: ['findHighlight', 'deleteCell'],
    components: {
        baseMenu,
        baseMenuItem,
    },
    setup(props, context) {
        const cellId = computed(()=>props.cellId);
        const isFindShow = ref(false);
        watch(cellId, ()=>{
            chrome.runtime.sendMessage({func: 'getById', type: 'cell', id: cellId.value}, (response)=>{
                if (response && response.highlight) {
                    console.log('highlight', response.highlight)
                    isFindShow.value = true;
                } else {
                    isFindShow.value = false;
                }
            })
        })
        function findEvent() {
            context.emit('findHighlight');
        }
        function deleteCellEvent() {
            context.emit('deleteCell');
        }
        return {
            isFindShow,
            findEvent,
            deleteCellEvent
        }
    }
}
</script>

<style scoped lang="less">

</style>