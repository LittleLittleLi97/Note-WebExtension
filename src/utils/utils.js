export function removeUrlQuery(url) {
    const obj = new URL(url);
    return obj.origin + obj.pathname;
}

export function copyObjToReactive(reactive, obj) {
    for (let key in obj) {
        reactive[key] = obj[key];
    }
}

export function parseReactiveToObj(reactive) {
    const obj = {};
    for (let key in reactive) {
        obj[key] = reactive[key];
    }
    return obj;
}