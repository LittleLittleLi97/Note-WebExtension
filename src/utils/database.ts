import { openDB, deleteDB, wrap, unwrap } from 'idb';

export const getDB = async ()=>{
    return await openDB('temp', 1, {
        upgrade(db) {
            const collectStore = db.createObjectStore("collect", { keyPath: "id" });
            collectStore.createIndex("id", "id", { unique: true }); 
            collectStore.createIndex("name", "name", { unique: false });
    
            const noteStore = db.createObjectStore("note", { keyPath: "id" });
            noteStore.createIndex("id", "id", { unique: true });
            noteStore.createIndex("title", "title", { unique: false });
            noteStore.createIndex("collect", "collect", { unique: false });
            noteStore.createIndex("collect_id", "collect_id", { unique: false });
            noteStore.createIndex("url", "url", { unique: false });
    
            const cellStore = db.createObjectStore("cell", {keyPath: "id"});
            cellStore.createIndex("id", "id", { unique: true });
            cellStore.createIndex("collect_id", "collect_id", { unique: false });
            cellStore.createIndex("note_id", "note_id", { unique: false });
    
            const highlightStore = db.createObjectStore("highlight", {keyPath: "url"});
            highlightStore.createIndex("url", "url", { unique: true });
        }
    })
}