import { DBMethods, getDB } from "@/utils/database";
import { BGrequest, DBReFunc } from "@/utils/interface";
import { IDBPDatabase } from "idb";

let db: IDBPDatabase;

(async ()=>{ // The top-level-await experiment is not enabled
    db = await getDB();
})();

chrome.runtime.onMessage.addListener(
    (request: BGrequest, sender, sendResponse)=>{ // 记得异步sendResponse需要返回true
        switch (request.type) {
            case 'db':
                /*
                    简直了这段。
                    key的类型不为string，为某个对象的key。
                    获取到function后需要指明这是个function。
                    参数需要指明参数个数满足要求。
                */
                (db[request.func as keyof IDBPDatabase] as DBReFunc)(...request.params).then((data: any)=>{
                    sendResponse(data)
                })
                break;
            default:
                break;
        }
        return true;
    }
)