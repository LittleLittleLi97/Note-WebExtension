<template>
    <div class="collect-manager">
        <ul class="option-list">
            <li class="option-item">
                <i class="iconfont icon-bianji"></i>
                <span class="option-name">编辑</span>
            </li>
            <li class="option-item" @click="deleteItemEvent">
                <i class="iconfont icon-shanchu"></i>
                <span class="option-name">删除</span>
            </li>
            <li class="option-item">
                <i class="iconfont icon-zhongmingming1"></i>
                <span class="option-name">重命名</span>
            </li>
            <li class="option-item">
                <i class="iconfont icon-link"></i>
                <span class="option-name">复制链接</span>
            </li>
        </ul>
        <div class="dividing-line"></div>
        <ul class="option-list">
            <li class="option-item">
                <i class="iconfont icon-share"></i>
                <span class="option-name">分享</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    // popup收藏夹右键管理
    name: 'CollectManager',
    emits: ["closeContextMenu", "deleteItem"],
    setup(props, context) {
        function deleteItemEvent() {
            context.emit('closeContextMenu');
            context.emit('deleteItem');
        }
        return {
            deleteItemEvent
        }
    }
}
</script>

<style scoped lang="less">
    .collect-manager {
        color: var(--note-ext-font);

        width: 216px;
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