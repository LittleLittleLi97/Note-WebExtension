import { defineStore } from 'pinia'
import { reactive, ReactiveEffect, ref, watch } from 'vue'
import { nanoid } from 'nanoid'

import { cell, cellList, collect, collectList, note } from '@/utils/interface';
import { DBMethods, getDB } from '@/utils/database';
import { getUrlIcon, removeUrlQuery } from '@/utils/webInfo';
import { copyObjToReactive, reactiveToObj } from '@/utils/utils';

export const useContentStore = defineStore('popup', ()=>{

    let lastCellId: string | null = null;
    let isNewNote = false;

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
    const cellList: cellList = reactive({});
    function initStore() {
        _getNote();
        _getCollectList();
    }
    function saveCell(cellId: string) {
        lastCellId = cellId;
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.put,
            params: ['cell', reactiveToObj(cellList[cellId])]
        });
        saveNote();
    }
    function saveNote() {
        if (lastCellId) noteInfo.content = cellList[lastCellId].content;
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.put,
            params: ['note', reactiveToObj(noteInfo)]
        });
        if (isNewNote) {
            isNewNote = false;
            collectList[noteInfo.collect_id].children.push(noteInfo.id);
            saveCollect();
        }
    }
    function saveCollect() {
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.put,
            params: ['collect', reactiveToObj(collectList[noteInfo.collect_id])]
        });
    }
    function createCell() {
        const id = nanoid();
        noteInfo.children.push(id);
        cellList[id] = {
            id,
            collect_id: noteInfo.collect_id,
            note_id: noteInfo.id,
            content: '',
            label: 'blue',
            highlight: false
        }
    }
    function _getCell(noteId: string) {
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.getAllFromIndex,
            params: ['cell', 'note_id', noteId]
        }, (data: Array<cell>)=>{
            data.forEach(item=>cellList[item.id] = item);
        })
    }
    function _getNote() {
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.getFromIndex,
            params: ['note', 'url', noteInfo.url]
        }, (data: note)=>{
            if (data) {
                _getCell(data.id);
                console.log(data.children)
                copyObjToReactive(noteInfo, data);
            }
            else { // 新页面
                isNewNote = true;
                createCell();
            }
        });
    }
    function _getCollectList() {
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.getAll,
            params: ['collect']
        }, (data: Array<collect>)=>{
            console.log(data)
            for (const key in data) collectList[data[key].id] = data[key];
        })
    }
    return {
        collectList,
        noteInfo,
        cellList,
        saveCell,
        saveNote,
        initStore,
    }
})