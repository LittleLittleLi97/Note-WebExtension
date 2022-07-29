import DataBase from "@/utils/DataBase.js";

const db = new DataBase();
db.getAllData('collect');
db.getAllData('note');

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse)=>{

		switch (request.func) {
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
			default:
				break;
		}
		return true;
    }
);

// db.updateDB('collect', {
// 	id: 'uuid125',
// 	name: '新闻',
// 	children: ['noteid001', 'noteid002']
// })

// db.updateDB('note', {
// 	id: 'noteid001',
// 	title: '你在搞啥子哟？',
// 	collect: '新闻',
// 	url: 'https://ask.csdn.net/questions/7762387',
// 	url_icon: 'https://g.csdnimg.cn/static/logo/favicon32.ico',
// 	content: '豫章故郡，洪都新府。星分翼轸，地接衡庐。襟三江而带五湖，控蛮荆而引瓯越。物华天宝，龙光射牛斗之墟；人杰地灵，徐孺下陈蕃之榻。雄州雾列，俊采星驰。台隍枕夷夏之交，宾主尽东南之美。都督阎公之雅望，棨戟遥临；宇文新州之懿范，襜帷暂驻。十旬休假，胜友如云；千里逢迎，高朋满座。腾蛟起凤，孟学士之词宗；紫电青霜，王将军之武库。家君作宰，路出名区；童子何知，躬逢胜饯。 ',
// })

// db.updateDB('note', {
// 	id: 'noteid002',
// 	title: '毕哩毕哩',
// 	collect: '新闻',
// 	url: 'https://www.bilibili.com/',
// 	url_icon: 'https://static.hdslb.com/mobile/img/512.png',
// 	content: 'Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃',
// })

// chrome.contextMenus.create({
//     id: "some-command",
//     title: "some title",
//     contexts: ["link"]
// });

// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//     if (info.menuItemId == "some-command") {
//         console.log("yay!");
//     }
// });
