export const selection = window.getSelection();

export function updateSelection(range) {
    selection.removeAllRanges();
    selection.addRange(range);
}

export function highlightText(range) {

    document.designMode = 'on';
    document.execCommand('BackColor', false, 'yellow');
    document.designMode = 'off';

}

export function highlightByInfo(info) {
    const startEl = getElementByPath(info.startPath);
    const endEl = getElementByPath(info.endPath);
    const range = new Range();
    // console.log('on start el', startEl.childNodes[0])
    // console.log('on end el', endEl.childNodes[0])
    range.setStart(startEl.childNodes[0], info.startOffset);
    range.setEnd(endEl.childNodes[0], info.endOffset);

    updateSelection(range);

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
        // startPath: getSelectorPath(range.startContainer.parentElement),
        // startOffset: range.startOffset,
        // endPath: getSelectorPath(range.endContainer.parentElement),
        // endOffset: range.endOffset
        startPath: getSelectorPath(selection.anchorNode.parentElement),
        startOffset: selection.anchorOffset,
        endPath: getSelectorPath(selection.focusNode.parentElement),
        endOffset: selection.focusOffset
    }
}

export function addCellDataIdForElement(range, id) {
    let st = selection.anchorNode.parentElement;
    let ed = selection.focusNode.parentElement;
    st.setAttribute('data-note-ext-cell-id', id);
    while (st != ed) {
        while (st!= ed && st.children.length) st = st.children[0];
        st.setAttribute('data-note-ext-cell-id', id);
        while (st != ed && !st.nextElementSibling) st = st.parentNode;
        if (st != ed) st = st.nextElementSibling;
    }
    selection.empty();
}

export function getElementByPath(path) {
    let el = document;
    path.forEach((item)=>{
        let splitItem = item.split(':');
        el = splitItem.length > 1 ? el.querySelectorAll(splitItem[0])[splitItem[1]] : el.querySelector(item);
    });
    return el;
}