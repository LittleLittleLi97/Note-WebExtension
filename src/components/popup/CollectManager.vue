<template>
    <div class="collect-manager" v-show="isShow" @click="(isShow=!isShow)" :style="props.location">
        <base-menu>
            <!-- <base-menu-item
                icon="iconfont icon-folder-add"
                title="添加文件夹"
                v-show="type==='global'"
            ></base-menu-item> -->
            <base-menu-item
                icon="iconfont icon-zhongmingming1"
                :title="i18n.rename"
                v-show="type==='folder' || type==='note'"
                @click="emit('rename')"
                ></base-menu-item>
            
            <div class="for-note" v-show="type==='note'">
                <base-menu-item
                    icon="iconfont icon-file-txt-fill"
                    :title="i18n.export + ' txt'"
                    @click="exportNoteEvent('txt')"
                    ></base-menu-item>
                <base-menu-item
                    icon="iconfont icon-file-markdown"
                    :title="i18n.export + ' md'"
                    @click="exportNoteEvent('md')"
                    ></base-menu-item>
            </div>
    
            <div class="delete" v-show="type==='folder' || type==='note'">
                <base-menu-line></base-menu-line>
                <base-menu-item
                    icon="iconfont icon-shanchu"
                    :title="i18n.delete"
                    @click="emit('delete')"
                ></base-menu-item>
            </div>
        </base-menu>
        <div class="mask"></div>
    </div>
</template>

<script setup lang="ts">
// popup收藏夹右键管理
import { computed, reactive, defineProps, defineEmits } from 'vue';
import baseMenu from '@/components/base/base-menu.vue'
import baseMenuItem from '@/components/base/base-menu-item.vue'
import baseMenuLine from '@/components/base/base-menu-line.vue'

const i18n = reactive({
    rename: chrome.i18n.getMessage('rename'),
    export: chrome.i18n.getMessage('export'),
    delete: chrome.i18n.getMessage('delete'),
});
const props = defineProps<{
    modelValue: boolean,
    type: string,
    id: string,
    location?: string
}>();
const emit = defineEmits(["update:modelValue", "rename", "delete", "download"]); // 先执行事件任务，再关闭contextMenu

const isShow = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    }
})
const type = computed(()=>props.type);

function exportNoteEvent(type: string) {
    emit('download', type)
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