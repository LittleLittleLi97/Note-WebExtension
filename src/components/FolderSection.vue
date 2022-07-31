<template>
    <div class="folder-section">
        <div class="title" @click="changeFolderState" :class="{'title-focus': folderState.collectCardShow}">
            <i class="iconfont" :class="folderState.iconfontClass"></i>{{ collectInfo.name }}
        </div>
        <div class="card-area" v-show="folderState.collectCardShow">
            <CollectCard 
                v-for="(item, index) in collectInfo.children" 
                :key="item" 
                :noteId="item"
            />
        </div>
    </div>
</template>

<script>
import CollectCard from '@/components/CollectCard'
import { computed, reactive } from '@vue/runtime-core'
export default {
    // popup折叠收藏夹
    name: 'FolderSection',
    props: {
        collectInfo: {
            type: Object,
            default: {}
        }
    },
    components: {
        CollectCard,
    },
    setup(props) {
        const collectInfo = computed(()=>props.collectInfo);
        const folderState = reactive({
            collectCardShow: false,
            iconfontClass: 'icon-tri-right'
        });
        function changeFolderState() {
            folderState.iconfontClass = folderState.collectCardShow ? 'icon-tri-right' : 'icon-tri-right-bottom-copy';
            folderState.collectCardShow = !folderState.collectCardShow;
        }
        return {
            collectInfo,
            folderState,
            changeFolderState
        }
    }
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
            
            border-radius: 1px;

            box-sizing: border-box;

            cursor: pointer;

            transition: background-color 0.3s;

            &:hover {
                background-color: var(--note-ext-popup-title-hover);
            }

            .iconfont {
                margin-right: 5px;
            }
        }
        .title-focus {
            padding: 3px 12px 5px 10px; // 解决加border后文字位移问题，top和left方向都减少2px
            border: 2px solid var(--note-ext-popup-title-focus);
        }
        .card-area {
            display: grid;
            grid-gap: 10px;

            margin-top: 10px;
            padding: 0 11px;

            box-sizing: border-box;
        }
    }
</style>