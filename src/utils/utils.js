export function removeUrlQuery(url) {
    const obj = new URL(url);
    return obj.origin + obj.pathname;
}

export function copyObjToReactive(reactive, obj) {
    for (let key in obj) {
        reactive[key] = obj[key];
    }
}

// ! 按理来讲，这个函数貌似不需要用，就算有用，深层的对象也没脱离proxy
export function parseReactiveToObj(reactive) {
    const obj = {};
    for (let key in reactive) {
        obj[key] = reactive[key];
    }
    console.log(obj);
    return obj;
}