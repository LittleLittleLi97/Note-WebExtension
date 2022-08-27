// 主要是封装了collect和note的删除操作，其余的操作还未封装

export function deleteCollect(id) {
    chrome.runtime.sendMessage({func: 'delete', type: 'collect', id});
    chrome.runtime.sendMessage({func: 'getByIndex', type: 'note', indexName: 'collect_id', indexValue: id}, (response)=>{
        response.forEach((item)=>{
            deleteNote(item.id);
        });
    });
}

export function deleteNote(id) {
    chrome.runtime.sendMessage({func: 'getById', type: 'note', id}, (response)=>{
        deleteHighlight(response.url);
        chrome.runtime.sendMessage({func: 'delete', type: 'note', id});
    });
    deleteCellByIndex('note_id', id);
}

export function deleteCell(id) {
    chrome.runtime.sendMessage({func: 'delete', type: 'cell', id});
}

export function deleteCellByIndex(indexName, indexValue) {
    chrome.runtime.sendMessage({func: 'deleteByIndex', type: 'cell', indexName, indexValue});
}

export function deleteHighlight(url) {
    chrome.runtime.sendMessage({func: 'delete', type: 'highlight', id: url});
}