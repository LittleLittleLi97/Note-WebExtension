<template>
    <li class="option-item">
        <i :class="icon"></i>
        <span class="option-name">{{ title }}</span>
    </li>
</template>

<script>
export default {
    name: 'base-menu-item',
    props: ["icon", "title"],
    setup(props) {
        return {
            icon: props.icon,
            title: props.title,
        }
    }
}
</script>

<style scoped lang="less">
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
</style>