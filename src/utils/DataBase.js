export default class DataBase {
    constructor(dbName="NotePlugin", version=1) {
        this.dbState = new Promise((resolve, reject) => {
            let db;
            // 打开数据库，若没有则会创建
            const request = indexedDB.open(dbName, version);

            request.onsuccess = function (event) {
                db = event.target.result; // 数据库对象
                console.log("数据库打开成功");
                resolve(db);
            };

            request.onerror = function (event) {
                console.log("数据库打开报错");
            };

            // 数据库创建或升级的时候会触发
            request.onupgradeneeded = function (event) {
                console.log("onupgradeneeded");
                db = event.target.result; // 数据库对象

                // table 收藏夹
                let collectStore = db.createObjectStore("collect", {
                    keyPath: "id", // 主键
                });
                // 索引
                collectStore.createIndex("id", "id", { unique: true }); 
                collectStore.createIndex("name", "name", { unique: false });

                let noteStore = db.createObjectStore("note", { keyPath: "id" });
                noteStore.createIndex("id", "id", { unique: true });
                noteStore.createIndex("title", "title", { unique: false });
                noteStore.createIndex("collect", "collect", { unique: false });
                noteStore.createIndex("url", "url", { unique: false });

                let cellStore = db.createObjectStore("cell", {keyPath: "id"});
                cellStore.createIndex("id", "id", { unique: true });
                // cellStore.createIndex("note_id", "note_id", { unique: false });
                // cellStore.createIndex("collect_id", "collect_id", { unique: false });
                // cellStore.createIndex("url", "url", { unique: false });
            };
        });
    }
	addData(storeName, data, successCallback, errorCallback) {
		this.dbState.then((db)=>{
			let request = db.transaction([storeName], "readwrite").objectStore(storeName).add(data);
			
			request.onsuccess = successCallback;
			request.onerror = errorCallback;
		})
	}
	getAllData(storeName, successCallback) {
		this.dbState.then((db)=>{
			let store = db.transaction([storeName]).objectStore(storeName);
			let request = store.getAll();

			request.onsuccess = successCallback;
		})
	}
	getDataByKey(storeName, key, successCallback, errorCallback) {
		this.dbState.then((db)=>{
			let request = db.transaction([storeName]).objectStore(storeName).get(key);
			
			request.onsuccess = successCallback;
			request.onerror = errorCallback;
		})
    }
	getDataByCursor(storeName) {
        this.dbState.then((db)=>{
            let list = [];
            let store = db.transaction(storeName, "readwrite").objectStore(storeName);
            let request = store.openCursor(); // 指针对象
            // 游标开启成功，逐行读数据
            request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    list.push(cursor.value);
                    cursor.continue(); // 遍历了存储对象中的所有内容
                } else {
                    console.log("游标读取的数据：", list);
                }
            };

        })
	}

    getDataByIndex(storeName, indexName, indexValue, successCallback, errorCallback) {
        // 索引查询。如果用get，只查一条数据；如果用getAll，查所有数据
        this.dbState.then((db)=>{
            let store = db.transaction(storeName, "readwrite").objectStore(storeName);
            let request = store.index(indexName).getAll(indexValue);
                request.onerror = function () {
                console.log("事务失败");
            };
            request.onsuccess = successCallback;
            request.onerror = errorCallback;
        })
    }
    updateDB(storeName, data, successCallback, errorCallback) {
        // 更新数据，如果没有会添加
        this.dbState.then((db)=>{
            let request = db.transaction([storeName], "readwrite").objectStore(storeName).put(data);
          
            request.onsuccess = successCallback;
            request.onerror = errorCallback;
        })
    }
    deleteDB(storeName, id, successCallback, errorCallback) {
        this.dbState.then((db)=>{
            var request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(id);
            
            request.onsuccess = successCallback;
            request.onerror = errorCallback;
        })
    }
}