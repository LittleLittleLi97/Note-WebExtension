import { defineStore } from 'pinia'
import { reactive, ReactiveEffect, ref, watch } from 'vue'
import { nanoid } from 'nanoid'

import { cell, cellList, collect, collectList, highlightInterface, note } from '@/utils/interface';
import { DBMethods, getDB } from '@/utils/database';
import { getUrlIcon, removeUrlQuery } from '@/utils/webInfo';
import { copyObjToReactive, reactiveToObj } from '@/utils/utils';

export const useContentStore = defineStore('popup', ()=>{

    let lastCellId: string | null = null;
    let isNewNote: boolean;

    const collectList: collectList = reactive({});
    const noteInfo: note = reactive({
        id: nanoid(),
        url: removeUrlQuery(window.location.href),
        url_icon: getUrlIcon(),
        title: document.getElementsByTagName('title')[0].innerText,
        content: '',
        collect_id: 'default',
        children: [],
    });
    const cellList: cellList = reactive({});
    const highlight: highlightInterface = reactive({
        url: removeUrlQuery(window.location.href),
        area: {}
    });
    function initStore() {
        _getNote();
        _getCollectList();
        getHighlight();
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
            saveCollect(noteInfo.collect_id);
        }
    }
    function saveCollect(collect_id: string) {
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.put,
            params: ['collect', reactiveToObj(collectList[collect_id])]
        });
    }
    function saveHighlight() {
        console.log(highlight)
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.put,
            params: ['highlight', reactiveToObj(highlight)]
        });
    }
    function addCell() {
        const id = createCell();
        saveCell(id);
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
        return id;
    }
    function addHighlightCell(id: string, text: string) {
        const index = noteInfo.children.indexOf(id);
        if (index === -1) {
            noteInfo.children.push(id);
            _update();
        }
        function _update() {
            saveNote();
            cellList[id] = {
                id,
                collect_id: noteInfo.collect_id,
                note_id: noteInfo.id,
                content: `> ${text.trim()}`,
                label: 'blue',
                highlight: true
            }
            saveCell(id);
        }
    }
    function newCollect(name: string, note_id: string, del_collect_id: string) {
        // 创建新收藏夹
        const id = nanoid();
        collectList[id] = {
            id,
            name,
            children: [],
            createTime: Date.now()
        }
        changeCollect(id, del_collect_id);
    }
    function changeCollect(newCollect_id: string, oldCollect_id: string){
        if (collectList[newCollect_id] && collectList[oldCollect_id]) {
            // 新收藏夹添加note记录
            collectList[newCollect_id].children.push(noteInfo.id);
            saveCollect(newCollect_id);
            // 旧收藏夹的children中删除note记录
            const children = collectList[oldCollect_id].children;
            const index = children.indexOf(noteInfo.id);
            if (index !== -1) children.splice(index, 1);
            saveCollect(oldCollect_id);
            // 更改note记录
            noteInfo.collect_id = newCollect_id;
            isNewNote = false; // 避免新笔记直接更改收藏夹时重复保存collect
            saveNote();
        }
    }
    function getHighlight() {
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.get,
            params: ['highlight', noteInfo.url]
        }, (response)=>{
            console.log(highlight)
            if (response) {
                copyObjToReactive(highlight, response);
            }
        })
    }
    async function getCell(cellId: string) {
        const data = await chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.get,
            params: ['cell', cellId],
        })!;
        if (data) {
            cellList[cellId] = data;
        }
        return true;
    }
    function _getNote() {
        chrome.runtime.sendMessage({
            type: 'db',
            func: DBMethods.getFromIndex,
            params: ['note', 'url', noteInfo.url]
        }, (data: note)=>{
            if (data) {
                copyObjToReactive(noteInfo, data);
            } else {
                isNewNote = true;
            }
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
        cellList,
        highlight,
        addCell,
        saveCell,
        getCell,
        addHighlightCell,
        getHighlight,
        saveHighlight,
        saveNote,
        initStore,
        newCollect,
        changeCollect,
    }
})