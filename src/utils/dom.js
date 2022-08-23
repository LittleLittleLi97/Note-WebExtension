export const selection = window.getSelection();

export function updateSelection(range) {
    selection.removeAllRanges();
    selection.addRange(range);
}

export function highlightText(id, color) {

    document.designMode = 'on';
    document.execCommand('BackColor', false, 'yellow');
    document.designMode = 'off';

    renderElement(id, color);

    selection.empty();
}

// 暂不用
export function highlightByInfo(info) {
    const startEl = getElementByPath(info.startPath);
    const endEl = getElementByPath(info.endPath);
    const range = new Range();

    range.setStart(startEl.childNodes[0], info.startOffset);
    range.setEnd(endEl.childNodes[0], info.endOffset);

    updateSelection(range);

    highlightText(range);
}

// 定位元素所在位置
export function getSelectorPath(el) {
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

// 记录highlight范围
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

export function renderElement(id, color) {
    function _func(el) {
        el.setAttribute('data-note-ext-cell-id', id);
        el.className = 'note-ext-highlight-text';
        el.style.cssText = `background-color: var(--note-ext-${color});`;
    }

    let st = selection.anchorNode.parentElement;
    let ed = selection.focusNode.parentElement;
    _func(st);
    while (st != ed) {
        while (st!= ed && st.children.length) st = st.children[0];
        _func(st);
        while (st != ed && !st.nextElementSibling) st = st.parentNode;
        if (st != ed) st = st.nextElementSibling;
    }
}

export function getElementByPath(path) {
    let el = document;
    console.log(path)
    path.forEach((item)=>{
        let splitItem = item.split(':');
        if (splitItem.length > 1) {
            el = el.children[splitItem[1]];
            console.log(splitItem);
            console.log('children分支')
        } else if (splitItem[0].slice(0,1) === '#') {
            el = el.querySelector(item);
            console.log(splitItem);
            console.log('id分支')
        } else {
            el = el.querySelector(item);
            console.log(splitItem);
            console.log('单个分支')
        }
        console.log(el);
        // el = splitItem.length > 1 ? el.querySelectorAll(splitItem[0])[splitItem[1]] : el.querySelector(item);
    });
    return el;
}