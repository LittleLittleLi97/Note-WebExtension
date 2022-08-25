import { finder } from '@medv/finder'
import { isNum } from './jsExt';

const reNodeIndex = /:nth-child\(([0-9]*)\)/;

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
export function getSelectorPath2(el) {
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
export function getSelectorPath3(el) {
    let res = finder(el);
    res = res.split(' > ')
    return res;
}
export function getSelectorPath(el) {
    const li = [];
    while(el !== document) {
        if (el.id) {
            li.unshift(`#${el.id}`);
            break;
        } else if (el.className) {
            li.unshift(`.${el.className.replaceAll(' ', '.')}`);
        } else {
            let siblings = el.parentNode.children;
            li.unshift([].indexOf.call(siblings, el));
        }
        el = el.parentNode;
    }
    return li;
}
export function getTopElementkey(el) {
    console.log(el)
    while (el.parentNode !== document.body) el = el.parentNode;
    if (el.id) {
        return `#${el.id}`;
    } else if (el.className) {
        return `.${el.className.replaceAll(' ', '.')}`;
    } else {
        let siblings = el.parentNode.children;
        return [].indexOf.call(siblings, el);
    }
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
    path.forEach((item)=>{
        if (typeof item === 'number') {
            el = el.children[item];
        } else if (isNum(item)) {
            el = el.children[parseInt(item)];
        } else {
            el = el.querySelector(item);
        }
        // el = splitItem.length > 1 ? el.querySelectorAll(splitItem[0])[splitItem[1]] : el.querySelector(item);
    });
    return el;
}

export function getElementByKey(key) {
    let el = document.body;

    if (isNum(key)) {
        el = el.children[parseInt(key)];
    } else {
        el = el.querySelector(key);
    }

    return el;
}

export function removeHighlight(el) {
    // 正则需要加上/g，Uncaught TypeError: String.prototype.replaceAll called with a non-global RegExp argument
    let innerHtml = el.innerHTML;
    innerHtml = innerHtml.replaceAll(/background-color: var\(--note-ext-[\S]*\);/g, '');
    innerHtml = innerHtml.replaceAll('note-ext-highlight-text', '');
    innerHtml = innerHtml.replaceAll(/data-note-ext-cell-id="[\S]*"/g, '');
    el.parentNode.innerHTML = el.parentNode.innerHTML.replace(el.outerHTML, innerHtml);
}

export function changeLabelColor(el, color) {
    console.log(el);
    console.log(el.style.cssText)
    el.style.cssText = el.style.cssText.replace(/var\(--note-ext-[\S]*\)/, `var(--note-ext-${color})`)
}