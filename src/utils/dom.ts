import { isNum } from "./utils";

export const selection = window.getSelection() as Selection;

export function updateSelection(range: Range) {
    selection.removeAllRanges();
    selection.addRange(range);
}

export function highlightText(id: string, color: string) {

    document.designMode = 'on';
    document.execCommand('BackColor', false, 'yellow');
    document.designMode = 'off';

    renderElement(id, color);

    selection.empty();
}

export function getTopElementkey(el: HTMLElement) {
    while (el.parentNode !== document.body) el = el.parentNode as HTMLElement;
    if (el.id) {
        return `#${el.id}`;
    } else if (el.className) {
        return `.${el.className.replaceAll(' ', '.')}`;
    } else {
        const siblings = el.parentNode.children;
        return Array.prototype.indexOf.call(siblings, el);
    }
}

export function renderElement(id: string, color: string) {
    function _func(el: HTMLElement) {
        el.setAttribute('data-note-ext-cell-id', id);
        el.className = 'note-ext-highlight-text';
        el.style.cssText = `background-color: var(--note-ext-${color});`;
    }

    // st的表达式用于解决用户可能选择空白行的bug
    let st = ((selection.anchorNode as HTMLElement).children ? selection.anchorNode : (selection.anchorNode as HTMLElement).parentElement) as HTMLElement;
    const ed = (selection.focusNode as HTMLElement).parentElement as HTMLElement;
    // console.log('node', selection.anchorNode)
    // console.log('children', selection.anchorNode.children)
    // console.log('st', st);
    // console.log('ed', ed);
    _func(st);
    while (st != ed) {
        while (st!= ed && st.children.length) st = st.children[0] as HTMLElement;
        _func(st);
        while (st != ed && !st.nextElementSibling) st = st.parentNode as HTMLElement;
        if (st != ed) st = st.nextElementSibling as HTMLElement;
    }
}

export function getElementByKey(key: any) {
    let el: any = document.body;

    if (isNum(key)) {
        el = el.children[parseInt(key)];
    } else {
        el = el.querySelector(key);
    }

    return el;
}

export function removeHighlight(el: HTMLElement) {
    // 正则需要加上/g，Uncaught TypeError: String.prototype.replaceAll called with a non-global RegExp argument
    let innerHtml = el.innerHTML;
    innerHtml = innerHtml.replaceAll(/background-color: var\(--note-ext-[\S]*\);/g, '');
    innerHtml = innerHtml.replaceAll('note-ext-highlight-text', '');
    innerHtml = innerHtml.replaceAll(/data-note-ext-cell-id="[\S]*"/g, '');
    (el.parentNode as HTMLElement).innerHTML = (el.parentNode as HTMLElement).innerHTML.replace(el.outerHTML, innerHtml);
}

export function changeLabelColor(el: HTMLElement, color: string) {
    el.style.cssText = el.style.cssText.replace(/var\(--note-ext-[\S]*\)/, `var(--note-ext-${color})`)
}

export function getAllElementsByCellId(id: string) {
    return document.querySelectorAll(`span[data-note-ext-cell-id="${id}"]`);
}