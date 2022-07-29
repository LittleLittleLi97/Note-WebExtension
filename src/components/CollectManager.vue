<template>
    <div class="collect-manager">
        <ul class="option-list">
            <li class="option-item">
                <i class="iconfont"></i>
                <span class="option-name">编辑</span>
            </li>
            <li class="option-item">
                <i class="iconfont"></i>
                <span class="option-name">删除</span>
            </li>
            <li class="option-item">
                <i class="iconfont"></i>
                <span class="option-name">重命名</span>
            </li>
            <li class="option-item">
                <i class="iconfont"></i>
                <span class="option-name">复制链接</span>
            </li>
        </ul>
        <ul class="option-list">
            <li class="option-item">
                <i class="iconfont"></i>
                <span class="option-name">分享</span></span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    // popup收藏夹右键管理
    name: 'CollectManager',

}
</script>

<style scoped lang="less">
    .collect-manager {
        color: #fff;

        width: 216px;
        height: 168px;

        padding: 4px;

        background-color: #4A4A4A;

        border: 1px solid #3A3A3A;
        border-radius: 4px;

        box-sizing: border-box;

        .option-list {
            padding: 4px;
            
            box-sizing: border-box;

            .option-item {
                display: flex;
                align-items: center;

                width: 100%;
                height: 28px;

                .option-name {
                    font-size: 13px;
                    line-height: 20px;
                }
            }
        }
    }
</style>