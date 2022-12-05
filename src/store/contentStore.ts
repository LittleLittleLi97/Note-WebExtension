import { defineStore } from 'pinia'
import { reactive, ReactiveEffect, ref } from 'vue'
import { nanoid } from 'nanoid'

import { collect, collectList, note } from '@/utils/interface';
import { DBMethods, getDB } from '@/utils/database';
import { IDBPDatabase } from 'idb';
import { getUrlIcon, removeUrlQuery } from '@/utils/webInfo';
import { copyObjToReactive } from '@/utils/utils';

export const useContentStore = defineStore('popup', ()=>{

    const collectList: collectList = reactive({});
    const noteInfo: note = reactive({
        id: nanoid(),
        url: removeUrlQuery(window.location.href),
        url_icon: getUrlIcon(),
        title: document.getElementsByTagName('title')[0].innerText,
        content: '',
        collect_id: '123',
        children: [],
    });
    function initStore() {
        _getNote();
        _getCollectList();
    }
    function _getNote() {
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.getFromIndex,
            params: ['note', 'url', noteInfo.url]
        }, (data: note)=>{
            copyObjToReactive(noteInfo, data);
        });
    }
    function _getCollectList() {
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.getAll,
            params: ['collect']
        }, (data: Array<collect>)=>{
            for (const key in data) collectList[data[key].id] = data[key];
        })
    }
    return {
        collectList,
        noteInfo,
        initStore,
    }
})