// import { reactive, ref } from '@vue/reactivity'
// export default class NoteManager {
//     static manager = new NoteManager();
//     info = reactive({
//         collect: [],
//         collectListName: [],
//     });
//     constructor() {
//         this.getCollect();
//     }
//     static getNoteManager() {
//         return NoteManager.manager;
//     }
//     // popup收藏夹
//     setCollect(data) {
//         this.info.collect = data;
//         chrome.storage.local.set({'collect': JSON.stringify(data)});
//     }
//     async getCollect() {
//         let result = await chrome.storage.local.get(['collect']);
//         this.info.collect = JSON.parse(result.collect);
//         this.getCollectListName();
//         this.getAbstract();
//         console.log(this.info.collect)
//     }
//     addCollect(collectName) {
//         if (this.info.collectListName.indexOf(collectName) !== -1) return false;
//         this.info.collect.push({
//             name: collectName,
//             children: []
//         });
//         this.collect.push(collectName);
//         this.setCollect(this.info.collect);
//     }
//     // 获取收藏夹列表名
//     getCollectListName() {
//         this.info.collectListName = this.info.collect.map((item)=>item.name);
//     }
//     // popup笔记简介
//     setAbstract(data) {
//         let id = data.id;
//         this.info[id] = data;
//         console.log(id);
//         chrome.storage.local.set({id: JSON.stringify(data)}, ()=>{
//             console.log('set ', id, JSON.stringify(data));
//         });
//     }
//     getAbstract() {
//         for (let i = 0; i < this.info.collect.length; i++) {
//             let children = this.info.collect[i].children;
//             for (let j = 0; j < children.length; j++) {
//                 chrome.storage.local.get(['ha89323'], (result)=>{
//                     console.log(result);
//                 })
//             }
//         }
//     }
//     // // content笔记
//     // setNote(data) {
//     //     localStorage.setItem(data.url, JSON.stringify(data));
//     // }
//     // getNote(key) {
//     //     return JSON.parse(localStorage.getItem(key));
//     // }
// }