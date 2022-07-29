<template>
    <a :href="noteInfo.url" target="_blank" :data-noteId="noteInfo.id">
        <div class="collect-card">
            <div class="web-icon"><img :src="noteInfo.url_icon" alt=""></div>
            <div class="right-info">
                <div class="title">{{ noteInfo.title }}</div>
                <div class="description">{{ noteInfo.content }}</div>
            </div>
        </div>
    </a>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from '@vue/runtime-core'
export default {
    // popup收藏卡片
    name: 'CollectCard',
    props: {
        noteId: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const noteId = computed(()=>props.noteId);
        const noteInfo = ref({});
        onMounted(()=>{
            chrome.runtime.sendMessage({func: 'getNoteById', id: noteId.value}, (response)=>{
                noteInfo.value = response;
            });
        })
        return {
            noteInfo
        }
    }
}
</script>

<style scoped lang="less">
    .collect-card {
        display: flex;

        color: #fff;

        width: 298px;
        height: 96px;

        padding: 10px;

        background-color: #424242;

        border-radius: 5px;
        // border: 1px solid #2C2625;

        box-sizing: border-box;

        .web-icon {
            width: 76px;
            height: 76px;

            img {
                width: 100%;
                height: 100%;

                border-radius: 10px;
            }
        }
        .right-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            margin-left: 15px;

            .title {
                font-size: 20px;
                font-weight: bold;
                line-height: 25px;

                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .description {
                font-size: 14px;
                line-height: 22px;

                display: -webkit-box;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
            }
        }
    }
</style>