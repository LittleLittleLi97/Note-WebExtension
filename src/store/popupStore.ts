import { defineStore } from 'pinia'
import { reactive, ReactiveEffect, ref } from 'vue'

import { collect, collectList, note } from '@/utils/interface';
import { getDB } from '@/utils/database';
import { IDBPDatabase } from 'idb';

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
            console.log(collectList)
        })
    }
    function getNote(id: string) {
        db.get('note', id).then((data: note)=>{
            noteInfo[data.id] = data;
            console.log(noteInfo)
            console.log(noteInfo[data.id])
        })
    }
    function updateNote(data: note) {
        noteInfo[data.id] = data;
        db.put('note', data);
    }

    function tempUpdateDB() {
        db.put('collect', {
            id: '123',
            name: 'item',
            children: ['noteid001'],
            createTime: 'now'
        })
        db.put('note', {
            id: 'noteid001',
            collect: 'item',
            collect_id: '123',
            title: '题目',
            url: 'www.baidu.com',
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
        getNote,
        updateNote,

        tempUpdateDB,
    }
})