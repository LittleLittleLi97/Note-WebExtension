export const selection = window.getSelection();

export function highlightText(range) {
    selection.removeAllRanges();
    selection.addRange(range);

    document.designMode = 'on';
    document.execCommand('BackColor', false, 'yellow');
    document.designMode = 'off';

    selection.empty()
}

export function highlightByInfo(info) {
    const startEl = getElementByPath(info.startPath);
    const endEl = getElementByPath(info.endPath);
    const range = new Range();
    range.setStart(startEl.childNodes[0], info.startOffset);
    range.setEnd(endEl.childNodes[0], info.endOffset);
    highlightText(range);
}

// 定位元素所在位置
export function getSelectorPath(el) { // 需要改进！！！！！
    let path = [], parent;
    while (parent = el.parentNode) {
        let tag = el.tagName, siblings;
        path.unshift(
            el.id ? `#${el.id}` : (
                siblings = parent.children,
                [].filter.call(siblings, sibling => sibling.tagName === tag).length === 1 ? tag :
                `${tag}:${[].indexOf.call(siblings, el)}`
            )
        );
        if (el.id) break;
        el = parent;
    };
    return path;
}

export function getHighlightInfo(range) {
    return {
        startPath: getSelectorPath(range.startContainer.parentElement),
        startOffset: range.startOffset,
        endPath: getSelectorPath(range.endContainer.parentElement),
        endOffset: range.endOffset
    }
}

export function addCellDataIdForElement(range, id) {
    let st = range.startContainer.parentElement;
    let ed = range.endContainer.parentElement;
    st.setAttribute('data-note-ext-cell-id', id);
    while (st != ed) {
        while (st!= ed && st.children.length) st = st.children[0];
        st.setAttribute('data-note-ext-cell-id', id);
        while (st != ed && !st.nextElementSibling) st = st.parentNode;
        if (st != ed) st = st.nextElementSibling;
    }
}

export function getElementByPath(path) {
    let el = document;
    path.forEach((item)=>{
        let splitItem = item.split(':');
        el = splitItem.length > 1 ? el.querySelectorAll(splitItem[0])[splitItem[1]] : el.querySelector(item);
    });
    return el;
}