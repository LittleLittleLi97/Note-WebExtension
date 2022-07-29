<template>
    <details class="folder-section">
        <summary class="title">{{ collectInfo.name }}</summary>
        <div class="card-area">
            <CollectCard 
                v-for="(item, index) in collectInfo.children" 
                :key="item" 
                :noteId="item"
            />
        </div>
    </details>
</template>

<script>
import CollectCard from '@/components/CollectCard'
import { computed } from '@vue/runtime-core'
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
        return {
            collectInfo
        }
    }
}
</script>

<style scoped lang="less">
    .folder-section {
        .title {
            text-align: left;
        }
        .card-area {
            display: grid;
            grid-gap: 10px;

            margin-top: 10px;
        }
    }
</style>