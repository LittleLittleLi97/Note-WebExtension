import { DBMethods } from "./database";
import { note, cell } from "./interface";

export function copyObjToReactive(reactive: any, obj: any) {
    for (const key in obj) {
        reactive[key] = obj[key];
    }
}

export function reactiveToObj(reactive: object) {
    return JSON.parse(JSON.stringify(reactive));
}

export function isEmptyObj(obj: object) {
    return Object.keys(obj).length === 0;
}

export function isNum(str: any) {
    if (!str) return false;
    return parseInt(str) == str ? true : false;
}

export function download(fileName: string, blob: Blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
}

export async function downloadNote(type: string, noteId?: string, title?: string, cellList?: Array<string>) {
    if (noteId) {
        const response: note = await chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.get,
            params: ['note', noteId]
        })!;
        title = response.title;
        cellList = response.children;
    }
    const fileName = `${title}.${type}`;
    let text = type === 'txt' ? `noteInfo.title\n\n` : `# ${title}\n\n`;
    const p = Promise.all(cellList!.map((id)=>chrome.runtime.sendMessage({
        type: 'db',
        func: DBMethods.get,
        params: ['cell', id]
    })));
    p.then((data)=>{
        for (let i = 0; i < data.length; i++) {
            text += (data[i]! as cell).content;
            if (i !== data.length - 1) text += '\n\n---\n\n';
        }
        const myBlob = new Blob([text], { type: "text/plain" });
        download(fileName, myBlob);
    })
}