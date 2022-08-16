<template>
    <div class="collect-manager">
        <ul class="option-list">
            <li class="option-item" @click="deleteCellEvent">
                <i class="iconfont icon-shanchu"></i>
                <span class="option-name">删除</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'NoteManager',
    emits: ['deleteCell'],
    setup(props, context) {
        function deleteCellEvent() {
            context.emit('deleteCell');
        }
        return {
            deleteCellEvent
        }
    }
}
</script>

<style scoped lang="less">
    .collect-manager {
        color: var(--note-ext-font);

        width: 216px;

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