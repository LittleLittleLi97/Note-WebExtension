export function removeUrlQuery(url) {
    const obj = new URL(url);
    return obj.origin + obj.pathname;
}

export function copyObjToReactive(reactive, obj) {
    for (let key in obj) {
        reactive[key] = obj[key];
    }
}

// ! 按理来讲，这个函数貌似不需要用，就算有用，深层的对象也没脱离proxy
export function parseReactiveToObj(reactive) {
    const obj = {};
    for (let key in reactive) {
        obj[key] = reactive[key];
    }
    console.log(obj);
    return obj;
}

export function download(fileName, blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
}

export async function downloadNote(type, {noteId, title, cellList}) {
    if (noteId) {
        let response = await chrome.runtime.sendMessage({func: 'getById', type: 'note', id: noteId});
        title = response.title;
        cellList = response.children;
        console.log(cellList);
    }
    const fileName = `${title}.${type}`;
    let text = type === 'txt' ? `noteInfo.title\n\n` : `# ${title}\n\n`;
    const p = Promise.all(cellList.map((id)=>chrome.runtime.sendMessage({func: 'getById', type: 'cell', id})))
    p.then((data)=>{
        for (let i = 0; i < data.length; i++) {
            if (data[i]) { // note.children中添加了值，但可能cell中并没有输入内容，因此在cell表中还不存在
                text += data[i].content;
                if (i !== data.length - 1) text += '\n\n---\n\n';
            }
        }
        const myBlob = new Blob([text], { type: "text/plain" });
        download(fileName, myBlob);
    })
}