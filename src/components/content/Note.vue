<template>
    <transition>
        <div 
            class="note-wrapper" 
            @click="closeContextMenu($event), closeMoreMenu($event)" 
            id="note-ext-main-content-area"
        >
            <div class="note-main-area" @contextmenu="openContextMenu">
                <div class="note-header">
                    <div class="header-top">
                        <div class="title">
                            <span 
                                class="title-show" 
                                v-show="titleState"
                                @click="changeTitleStart"
                            >{{noteInfo.title}}</span>
                            <input type="text" 
                                class="title-input"
                                ref="titleInputBox"
                                v-model="noteInfo.title" 
                                v-show="!titleState"
                                @keypress.enter="changeTitleEnd"
                                @blur="changeTitleEnd"
                            >
                        </div>
                        <div class="more">
                            <i class="iconfont icon-gengduo" ref="openMoreDiv" @click="openMoreMenu"></i>
                            <i class="iconfont icon-shanchu2" @click="closeNoteEvent"></i>
                            <div class="more-gengduo" v-show="moreMenuShow">
                                <base-menu>
                                    <base-menu-item
                                        icon="iconfont icon-file-txt-fill"
                                        title="导出txt"
                                        @click="exportNote('txt')"
                                    ></base-menu-item>
                                    <base-menu-item
                                        icon="iconfont icon-file-markdown"
                                        title="导出md"
                                        @click="exportNote('md')"
                                    ></base-menu-item>
                                </base-menu>
                            </div>
                        </div>
                    </div>
                    <div class="classification-area">
                        <i class="iconfont icon-shoucang"></i>
                        <select class="classification"
                            v-model="noteInfo.collect_id"
                            v-show="collectState"
                        >
                            <option 
                                v-for="(item, index) in collectList"
                                :selected="noteInfo.collect_id==item.id"
                                :value="item.id"
                            >{{ item.name }}</option>
                            <option>{{ createCollectButton }}</option>
                        </select>
                        <input type="text"
                            class="collect-input"
                            ref="collectInputBox"
                            v-show="!collectState"
                            @keypress.enter="createCollectEnd"
                            @blur="cancelCreateCollect"
                        >
                    </div>
                </div>
                <div class="cell-area" ref="cellAreaDiv">
                    <CellCard 
                        v-for="(item, index) in noteInfo.children" 
                        :key="item"
                        :cellId="item"
                        class="cell-card"
                        @saveNote="saveNote"
                    />
                    <div class="add-cell-button" @click="addCell">
                        <i class="iconfont icon-add"></i>
                    </div>
                </div>
            </div>
            <div class="note-manager" v-show="noteManagerShow" ref="noteManagerDiv">
                <NoteManager @deleteCell="deleteCell"></NoteManager>
            </div>
        </div>
    </transition>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { computed, nextTick, onMounted, watch } from '@vue/runtime-core';
import { nanoid } from 'nanoid'
import PubSub from 'pubsub-js'
import { copyObjToReactive, removeUrlQuery, parseReactiveToObj, download } from '@/utils/utils'
import CellCard from '@/components/content/CellCard'
import NoteManager from '@/components/content/NoteManager'
import baseMenu from '@/components/base/base-menu'
import baseMenuItem from '@/components/base/base-menu-item'
export default {
    name: 'Note',
    emits: ['showNote', 'closeNote'],
    components: {
        CellCard,
        NoteManager,
        baseMenu,
        baseMenuItem,
    },
    setup(props, context) {
        const collectList = reactive({});
        const noteInfo = reactive({
            id: null,
            url: '',
            url_icon: '',
            title: '',
            content: '',
            collect: '',
            collect_id: '',
            children: [],
        });
        const isNewNote = ref(false);
        // 存储
        function saveNote({ newContent }) {
            console.log('保存笔记')
            if (newContent) noteInfo.content = newContent;
            chrome.runtime.sendMessage({
                func: 'save',
                type: 'note',
                data: parseReactiveToObj(noteInfo)
            });
            if (isNewNote.value) { // 如果是新的笔记，需要加入收藏夹
                isNewNote.value = false;
                noteInfo.collect = collectList[noteInfo.collect_id].name;
                collectList[noteInfo.collect_id].children.push(noteInfo.id);
                chrome.runtime.sendMessage({func: 'save', type: 'collect', data: collectList[noteInfo.collect_id]});
            }
        }
        // 初始化信息
        onMounted(()=>{
            // note信息
            let icon1 = document.querySelector("link[rel='apple-touch-icon']");
            let icon2 = document.querySelector("link[rel='shortcut icon']");
            let icon3 = document.querySelector("link[rel='icon']");
            let iconValid = icon1 || icon2 || icon3;
            console.log(iconValid.href);
            noteInfo.url_icon = iconValid ? iconValid.href : '/img/Icon-128.png';
            noteInfo.url = removeUrlQuery(window.location.href);

            chrome.runtime.sendMessage({func: 'getNoteByUrl', url: noteInfo.url}, (response)=>{
                if (response) {
                    copyObjToReactive(noteInfo, response);
                } else { // 默认创建的cell，在写入内容后保存
                    isNewNote.value = true;
                    noteInfo.id = nanoid();
                    noteInfo.children.push(nanoid());
                    noteInfo.title = document.getElementsByTagName('title')[0].innerText;
                    noteInfo.collect_id = 'defaultcollect';
                }
            });

            // collect列表
            chrome.runtime.sendMessage({func: 'getCollect'}, (response)=>{
                for (let key in response) collectList[response[key].id] = response[key];
            })

            // 响应文字高亮
            PubSub.subscribe('addHighlightCell', (msg, {id, text})=>{
                if (isNewNote.value) { // 如果有默认创建的cell，则替换此cell
                    noteInfo.children[0] = id;
                    _update();
                } else {
                    let index = noteInfo.children.indexOf(id);
                    if (index === -1) { // 如果children中没有，push；如果有则不push
                        noteInfo.children.push(id);
                        _update();
                    }
                }
                showNoteEvent();
                
                function _update() {
                    saveNote({newContent:'加入了新的注释...'});
                    chrome.runtime.sendMessage({
                        func: 'save',
                        type: 'cell',
                        data: {
                            id,
                            content: `> ${text.trim()}`,
                            label: 'blue'
                        }
                    });
                }
            });
        })

        // 初始化样式
        function initStyle() {
            const cellAreaDiv = ref(null);
            onMounted(()=>{
                cellAreaDiv.value.style.cssText = `height: ${window.innerHeight - 112}px`;
            })
            return {
                cellAreaDiv,
            }
        }

        // 更改题目
        function titleChangeFunction() {

            const titleState = ref(true); // true常态 false修改
            const titleInputBox = ref(null);

            function changeTitleStart() {
                titleState.value = false;
                nextTick(()=>titleInputBox.value.focus()); // 出来后才能focus
            }
            function changeTitleEnd() {
                titleState.value = true;
                saveNote({});
            }

            return {
                titleState,
                titleInputBox,
                changeTitleStart,
                changeTitleEnd,
            }
        }
        
        // 更改收藏夹
        function changeCollect() {
            const createCollectButton = ref('新建...');
            const collectState = ref(true); // true常态 false修改
            const collectInputBox = ref(null);
            let lastCollectId = noteInfo.collect_id; // 新建文件夹前，点击新建。。。，导致下一次watch中oldValue值不对

            function createCollectEnd() {
                const id = nanoid();
                const name = collectInputBox.value.value;
                collectList[id] = {
                    id,
                    name,
                    children: []
                };
                chrome.runtime.sendMessage({func: 'save', type: 'collect', data: collectList[id]}, ()=>{
                    noteInfo.collect = name;
                    noteInfo.collect_id = id;
                    collectState.value = true;
                });
            }
            function cancelCreateCollect() {
                noteInfo.collect_id = lastCollectId;
                collectState.value = true;
                collectInputBox.value.value = '';
            }
            watch(()=>noteInfo.collect_id, (newValue, oldValue)=>{
                if (!newValue || !oldValue) return;
                if (newValue == createCollectButton.value) { // 新建收藏夹
                    collectState.value = false;
                    lastCollectId = oldValue;
                    nextTick(()=>collectInputBox.value.focus());
                    return;
                }
                saveNote({});
                // 新的收藏夹中添加note
                let newCollect = collectList[newValue];
                newCollect.children.push(noteInfo.id);
                chrome.runtime.sendMessage({func: 'save', type: 'collect', data: newCollect});

                // 旧的收藏夹中删除note
                let oldId = oldValue === createCollectButton.value ? lastCollectId : oldValue;
                let oldCollect = collectList[oldId];
                let index = oldCollect.children.indexOf(noteInfo.id);
                if (index !== -1) oldCollect.children.splice(index, 1);
                chrome.runtime.sendMessage({func: 'save', type: 'collect', data: oldCollect});
            })
            return {
                createCollectButton,
                collectState,
                collectInputBox,
                createCollectEnd,
                cancelCreateCollect,
            }
        }

        function addCell() {
            noteInfo.children.push(nanoid());
            saveNote({});
        }

        // 打开Note
        function showNoteEvent() {
            context.emit('showNote');
        }
        // 关闭Note
        function closeNoteEvent() {
            context.emit('closeNote');
        }

        // NoteManger
        function noteManagerFunction() {
            const noteManagerShow = ref(false);
            const noteManagerDiv = ref(null);
            let cellId = null;
            function openContextMenu(event) {
                const path = event.path;
                let flag = false;
                path.forEach((item)=>{
                    try {
                        let tempCellId = item.getAttribute('data-cellId');
                        if (tempCellId) {
                            cellId = tempCellId;
                            flag = true;
                            event.preventDefault();
                            // 定位依据.note-wrapper fixed
                            noteManagerDiv.value.style.cssText = `top: ${event.clientY}px; left: ${event.pageX - (document.body.clientWidth - 400)}px;`;
                            noteManagerShow.value = true;
                            document.addEventListener('mousewheel', stopWheel, {passive: false});
                        }
                    } catch (error) {
                    }
                });
                if (!flag) { // 右键了别的地方
                    closeContextMenu();
                    cellId = null;
                }
            }
            function closeContextMenu() {
                noteManagerShow.value = false;
                document.removeEventListener('mousewheel', stopWheel);
            }
            function stopWheel(event) { // 关闭鼠标滚轮滑动事件，页面滚动会导致定位错误
                event.preventDefault();
            }
            function deleteCell() {
                let id = cellId;
                let children = noteInfo.children;
                let index = children.indexOf(id);
                if (index !== -1) children.splice(index, 1);
                chrome.runtime.sendMessage({func: 'save', type: 'note', data: noteInfo});
                chrome.runtime.sendMessage({func: 'delete', type: 'cell', id});
            }
            return {
                noteManagerShow,
                noteManagerDiv,
                openContextMenu,
                closeContextMenu,
                deleteCell,
            }
        }
        // more目录
        function moreMenuFuntion() {
            const moreMenuShow = ref(false);
            const openMoreDiv = ref(null);
            function openMoreMenu() {
                moreMenuShow.value = true;
            }
            function closeMoreMenu(event) {
                if (!openMoreDiv.value.contains(event.target)) moreMenuShow.value = false;
            }
            function exportNote(type='txt') {
                const fileName = `${noteInfo.title}.${type}`;
                let text = type === 'txt' ? `noteInfo.title\n\n` : `# ${noteInfo.title}\n\n`;
                const p = Promise.all(noteInfo.children.map((id)=>chrome.runtime.sendMessage({func: 'getCellById', id})))
                p.then((data)=>{
                    for (let i = 0; i < data.length; i++) {
                        text += data[i].content;
                        if (i !== data.length - 1) text += '\n\n---\n\n';
                    }
                    const myBlob = new Blob([text], { type: "text/plain" });
                    download(fileName, myBlob);
                })
            }
            return {
                moreMenuShow,
                openMoreDiv,
                openMoreMenu,
                closeMoreMenu,
                exportNote,
            }
        }
        return {
            collectList,
            noteInfo,
            ...initStyle(),
            ...titleChangeFunction(),
            ...changeCollect(),
            saveNote,
            addCell,
            showNoteEvent,
            closeNoteEvent,
            ...noteManagerFunction(),
            ...moreMenuFuntion(),
        }
    }
}
</script>

<style scoped lang="less">
.note-wrapper {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 9999;

    display: flex;
    flex-direction: column;

    color: var(--note-ext-font);

    width: 400px;
    height: 100%;
    background-color: var(--note-ext-theme2);

    border: 1px solid var(--note-ext-border);

    box-sizing: border-box;

    .note-main-area {
        .note-header {
            padding: 14px 16px;
    
            border-bottom: 1px solid var(--note-ext-line);
    
            box-sizing: border-box;
    
            .header-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
    
                width: 100%;
                height: 56px;
    
                margin-left: 5px; // 下面收藏夹hover动画的padding的5px，这里设置让文字对齐。
    
                .title {
                    font-size: 22px;
                    font-weight: bold;
                    text-align: left;
    
                    width: 256px;
    
                    border-radius: 5px;
    
                    overflow: hidden;
    
                    .title-show {
                        display: block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
    
                        transition: background-color 0.2s;
    
                        cursor: pointer;
    
                        &:hover {
                            background-color: var(--note-ext-icon-hover);
                        }
                    }
    
                    .title-input {
                        font-size: inherit;
                        color: inherit;
                        font-weight: inherit;
    
                        background-color: transparent;
    
                        border: none;
                        
                        outline: none;
    
                        &:focus {
                            background-color: var(--note-ext-icon-hover);
                        }
                    }
                }
                .more {
                    position: relative;

                    display: flex;
                    align-items: center;
        
                    .iconfont {
                        font-size: 22px;
                        text-align: center;
                        line-height: 30px;
    
                        width: 30px;
                        height: 30px;
        
                        margin-left: 12px;
    
                        border-radius: 5px;
    
                        transition: background-color 0.2s;
    
                        cursor: pointer;
    
                        &:hover {
                            background-color: var(--note-ext-icon-hover);
                        }
                    }
                    .more-gengduo {
                        position: absolute;
                        top: -3px;
                        right: 70px;
                    }
                }
            }
            .classification-area {
                display: inline-flex; // 宽度自适应，不占整行
                justify-content: center;
                align-items: center;
    
                padding: 2px 5px;
    
                border-radius: 5px;
    
                box-sizing: border-box;
    
                transition: background-color 0.2s;
    
                cursor: pointer;
    
                &:hover {
                    background-color: var(--note-ext-icon-hover);
                }
    
                .iconfont {
                    font-size: 20px;
                }
                .classification {
                    font-size: 16px;
                    color: var(--note-ext-font);
                    font-family: Segoe UI;
                    font-weight: Semilight;
                    line-height: normal;
                    letter-spacing: 0px;
                    text-align: left;
    
                    margin-left: 10px;
    
                    background-color: transparent;
    
                    border: none;
    
                    outline: none;
    
                    cursor: pointer;
    
                    -webkit-appearance: none;

                    option {
                        color: var(--note-ext-font);
                        background-color: var(--note-ext-theme2);
                    }
                }
            }
        }
        .cell-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
    
            padding: 10px 20px;
    
            overflow-y: scroll;
            scroll-behavior: contain;
    
            &::-webkit-scrollbar {
                display: none;
            }
            .cell-card {
                margin-top: 10px;
            }
            .add-cell-button {
                text-align: center;
    
                width: 50%;
    
                margin-top: 10px;
    
                background-color: transparent;
    
                border: 2px solid var(--note-ext-font);
                border-radius: 5px;
    
                box-sizing: border-box;
    
                cursor: pointer;
    
                transition: background-color 0.2s;
    
                &:hover {
                    background-color: var(--note-ext-context-hover);
                }
                .iconfont {
                    font-size: 20px;
                    color: var(--note-ext-font);
                }
            }
        }
    }
    .note-manager {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10000;
    }
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>