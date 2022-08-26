import { nanoid } from 'nanoid';
import DataBase from "@/utils/DataBase.js";

const db = new DataBase();

// 展示样例
// db.getAllData('collect');
// db.getAllData('note');
// db.getAllData('cell');

// db.updateDB('collect', {
// 	id: 'collect001',
// 	name: '前端',
// 	children: ['note001', 'note002', 'note003'],
// });

// db.updateDB('note', {
// 	id: 'note001',
// 	collect: '前端',
// 	collect_id: 'collect001',
// 	content: 'flex可以使元素具有弹性，让元素可以跟随页面大小的改变而改变',
// 	title: 'CSS',
// 	url: 'https://www.bilibili.com/video/BV1xq4y1q7jZ',
// 	url_icon: 'https://static.hdslb.com/mobile/img/512.png',
// 	children: ['cell001', 'cell002', 'cell003'],
// })
// db.updateDB('note', {
// 	id: 'note002',
// 	collect: '前端',
// 	collect_id: 'collect001',
// 	content: 'debounce的特点是当事件快速连续不断触发时，动作只会执行一次',
// 	title: '防抖与节流',
// 	url: 'https://blog.csdn.net/hupian1989/article/details/80920324',
// 	url_icon: 'https://g.csdnimg.cn/static/logo/favicon32.ico',
// 	children: [],
// })
// db.updateDB('note', {
// 	id: 'note003',
// 	collect: '前端',
// 	collect_id: 'collect001',
// 	content: '柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。',
// 	title: '函数柯里化',
// 	url: 'https://www.cnblogs.com/bidong/p/15498133.html',
// 	url_icon: 'https://common.cnblogs.com/favicon.svg',
// 	children: [],
// })

// db.updateDB('cell', {
// 	id: 'cell001',
// 	collect_id: 'collect001',
// 	note_id: 'note001',
// 	label: 'blue',
// 	content: '块元素：\n在页面中独占一行\n默认宽度是父元素的全部（会把父元素撑满）\n默认高度是被内容撑开（子元素）'
// })

// db.updateDB('cell', {
// 	id: 'cell002',
// 	collect_id: 'collect001',
// 	note_id: 'note001',
// 	label: 'yellow',
// 	content: '盒子模型：\n包括content、border、padding、margin\n标准盒模型：\nW3C标准盒模型，width 等于 content 的宽度\n怪异盒模型：\nIE盒子模型，width 等于 content + padding + border 的宽度'
// })

// db.updateDB('cell', {
// 	id: 'cell003',
// 	collect_id: 'collect001',
// 	note_id: 'note001',
// 	label: 'red',
// 	content: 'flex可以使元素具有弹性，让元素可以跟随页面大小的改变而改变'
// })

// db.updateDB('collect', {
// 	id: 'collect002',
// 	name: '随笔',
// 	children: ['note005', 'note006'],
// });
// db.updateDB('note', {
// 	id: 'note005',
// 	collect: '随笔',
// 	collect_id: 'collect002',
// 	content: '任凭敌军团团围困，我军依然毫不畏惧，岿然不可撼动。',
// 	title: '敌军围困万千重，我自岿然不动',
// 	url: 'https://www.bilibili.com/video/BV1xq4y1q7jZ',
// 	url_icon: 'https://statics.itc.cn/web/static/images/pic/sohu-logo/logo-144.png',
// })
// db.updateDB('note', {
// 	id: 'note006',
// 	collect: '随笔',
// 	collect_id: 'collect002',
// 	content: '世上奇妙雄伟、珍异奇特、非同寻常的景观，常常在那险阻、僻远少有人至的地方，所以，不是有意志的人是不能到达的。',
// 	title: '世之奇伟、瑰怪，非常之观，常在于险远，而人之所罕至焉，故非有志者不能至也。',
// 	url: 'https://www.bilibili.com/video/BV1xq4y1q7jZ',
// 	url_icon: 'https://baikebcs.bdimg.com/cms/static/baike-icon.svg',
// })



chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse)=>{

		switch (request.func) { // 需要重构
			case 'getCollect':
				db.getAllData('collect', (event)=>{
					sendResponse(event.target.result);
				});
				break;
			case 'getNoteById':
				db.getDataByKey('note', request.id, (event)=>{
					sendResponse(event.target.result);
				});
				break;
			case 'getNoteByUrl':
				db.getDataByIndex('note', 'url', request.url, (event)=>{
					let result = event.target.result;
					if (result.length > 0) sendResponse(result[0]);
					else sendResponse(null);
				});
				break;
			case 'getCellById':
				db.getDataByKey('cell', request.id, (event)=>{
					sendResponse(event.target.result);
				});
				break;
			case 'getHighlightByUrl':
				db.getDataByKey('highlight', request.url, (event)=>{
					sendResponse(event.target.result);
				});
				break;
			case 'save':
				db.updateDB(request.type, request.data, ()=>sendResponse('OK'));
				break;
			case 'delete':
				db.deleteDB(request.type, request.id, ()=>sendResponse('OK'));
				break;
			case 'print': // 由于popup重写了右键，不能打开检查，所以在此console.log
				console.log(request.c);
			default:
				break;
		}
		return true;
    }
);