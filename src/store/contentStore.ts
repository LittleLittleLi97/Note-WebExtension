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
    async function initStore() {
        _getNote();
    }
    async function _getNote() {
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.getFromIndex,
            params: ['note', 'url', noteInfo.url]
        }, (r)=>console.log(r))
        // chrome.runtime.sendMessage({
        //     type: 'db',
        //     func: DBMethods.getAll,
        //     params: ['note']
        // })
    }
    function getCollectList() {
        1
    }
    return {
        initStore,
    }
})