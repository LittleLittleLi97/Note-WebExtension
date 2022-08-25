<template>
    <div class="collect-manager">
        <ul class="option-list">
            <!-- <li class="option-item">
                <i class="iconfont icon-bianji"></i>
                <span class="option-name">编辑</span>
            </li> -->
            <li class="option-item" v-show="type==='global'" @click="createCollectEvent">
                <i class="iconfont icon-add"></i>
                <span class="option-name">新建...</span>
            </li>
            <li class="option-item" v-show="type==='local'" @click="renameItemEvent">
                <i class="iconfont icon-zhongmingming1"></i>
                <span class="option-name">重命名</span>
            </li>
            <li class="option-item" v-show="type==='local'" @click="deleteItemEvent">
                <i class="iconfont icon-shanchu"></i>
                <span class="option-name">删除</span>
            </li>
            <!-- <li class="option-item">
                <i class="iconfont icon-link"></i>
                <span class="option-name">复制链接</span>
            </li> -->
        </ul>
        <!-- <div class="dividing-line"></div>
        <ul class="option-list">
            <li class="option-item">
                <i class="iconfont icon-share"></i>
                <span class="option-name">分享</span>
            </li>
        </ul> -->
    </div>
</template>

<script>
import { computed } from '@vue/runtime-core';
import PubSub from 'pubsub-js'
export default {
    // popup收藏夹右键管理
    name: 'CollectManager',
    props: ["type"],
    emits: ["closeContextMenu", "deleteItem", "renameItem", "createItem"], // 先执行事件任务，再关闭contextMenu
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
    .collect-manager {
        color: var(--note-ext-font);

        // width: 216px;
        width: 120px;
        // height: 168px;

        background-color: var(--note-ext-theme);

        border-radius: 4px;
        
        box-shadow: 0px 4px 12px 0px #00000066,0px 0px 2px 0px #0000003F;

        box-sizing: border-box;

        .option-list {
            padding: 4px;

            box-sizing: border-box;

            .option-item {
                display: flex;
                align-items: center;

                width: 100%;
                height: 28px;

                background-color: var(--note-ext-theme);

                border-radius: 4px;

                cursor: pointer;

                transition: background-color 0.2s;

                &:hover {
                    background-color: var(--note-ext-context-hover);
                }

                .iconfont {
                    font-size: 18px;

                    padding: 6px 0 6px 10px;

                    box-sizing: border-box;
                }

                .option-name {
                    font-size: 13px;
                    line-height: 20px;

                    margin-left: 14px;
                }
            }
        }
        .dividing-line {
            width: 100%;
            border-top: 1px solid var(--note-ext-line);
        }
    }
</style>