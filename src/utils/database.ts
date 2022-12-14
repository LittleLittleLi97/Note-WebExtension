import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { IDBPDatabase } from 'idb';
import { collectList, collect, note } from './interface';

export const getDB = async ()=>{
    const db = await openDB('MyNoteDB', 1, {
        upgrade(db) {
            const collectStore = db.createObjectStore("collect", { keyPath: "id" });
            collectStore.createIndex("id", "id", { unique: true }); 
            collectStore.createIndex("name", "name", { unique: false });
    
            const noteStore = db.createObjectStore("note", { keyPath: "id" });
            noteStore.createIndex("id", "id", { unique: true });
            noteStore.createIndex("title", "title", { unique: false });
            // noteStore.createIndex("collect", "collect", { unique: false });
            noteStore.createIndex("collect_id", "collect_id", { unique: false });
            noteStore.createIndex("url", "url", { unique: false });
    
            const cellStore = db.createObjectStore("cell", {keyPath: "id"});
            cellStore.createIndex("id", "id", { unique: true });
            cellStore.createIndex("collect_id", "collect_id", { unique: false });
            cellStore.createIndex("note_id", "note_id", { unique: false });
    
            const highlightStore = db.createObjectStore("highlight", {keyPath: "url"});
            highlightStore.createIndex("url", "url", { unique: true });
        }
    });
    db.get('collect', 'default').then((response)=>{
        if (!response) {
            db.put('collect', {
                id: 'default',
                name: chrome.i18n.getMessage('default_favorites'),
                children: [],
                createTime: Date.now()
            });
        }
    })
    return db;
}

export const DBMethods = {
    get: 'get',
    getAll: 'getAll',
    put: 'put',
    getFromIndex: 'getFromIndex',
    getAllFromIndex: 'getAllFromIndex',
    getAllKeysFromIndex: 'getAllKeysFromIndex',
    delete: 'delete',
};