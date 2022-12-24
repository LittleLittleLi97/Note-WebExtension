import { defineStore } from 'pinia'
import { reactive, ReactiveEffect, ref } from 'vue'
import { nanoid } from 'nanoid'

import { collect, collectList, note } from '@/utils/interface';
import { getDB } from '@/utils/database';
import { IDBPDatabase } from 'idb';
import { reactiveToObj } from '@/utils/utils';

export const usePopupStore = defineStore('popup', ()=>{
    let db: IDBPDatabase;

    
    const collectList: collectList = reactive({});
    const noteInfo: {[id: string]: note} = reactive({});
    
    async function initDB() {
        db = await getDB();
    }
    function getCollectList() {
        db.getAll('collect').then((data: Array<collect>)=>{
            for (const key in data) collectList[data[key].id] = data[key];
        })
    }
    function saveCollect(id: string) {
        db.put('collect', reactiveToObj(collectList[id]));
    }
    function updateCollect(data: collect) {
        collectList[data.id] = data;
        db.put('collect', reactiveToObj(data));
    }
    function createCollect(name: string) {
        const newCollect: collect = {
            id: nanoid(),
            name,
            children: [],
            createTime: Date.now()
        };
        collectList[newCollect.id] = newCollect;
        saveCollect(newCollect.id);
    }
    function deleteCollect(id: string) {
        db.delete('collect', id);
        const children = collectList[id].children;
        children.forEach((item)=>deleteNote(item));
        delete collectList[id];
    }
    function getNote(id: string) {
        db.get('note', id).then((data: note)=>{
            noteInfo[data.id] = data;
        })
    }
    function updateNote(data: note) {
        noteInfo[data.id] = data;
        db.put('note', reactiveToObj(data));
    }
    function deleteNote(id: string) {
        db.delete('note', id);
        const collect_id = noteInfo[id].collect_id;
        const collect_children = collectList[collect_id].children;
        const index = collect_children.indexOf(id);
        collect_children.splice(index, 1);
        saveCollect(collect_id);
        const children = noteInfo[id].children;
        children.forEach((item)=>{
            db.delete('cell', item);
        });
        db.delete('highlight', noteInfo[id].url);
        delete noteInfo[id];
    }

    function tempUpdateDB() {
        db.put('collect', {
            id: '123',
            name: 'item',
            children: ['noteid001'],
            createTime: Date.now()
        })
        db.put('note', {
            id: 'noteid001',
            collect: 'item',
            collect_id: '123',
            title: '题目',
            url: 'https://www.baidu.com/',
            url_icon: '',
            content: '内容在此',
            children: []
        })
    }

    return {
        collectList,
        noteInfo,
        initDB,
        getCollectList,
        saveCollect,
        updateCollect,
        createCollect,
        deleteCollect,
        getNote,
        updateNote,
        deleteNote,

        tempUpdateDB,
    }
})