export function copyObjToReactive(reactive: any, obj: any) {
    for (const key in obj) {
        reactive[key] = obj[key];
    }
}

export function reactiveToObj(reactive: object) {
    return JSON.parse(JSON.stringify(reactive));
}

export function isEmptyObj(obj: object) {
    return Object.keys(obj).length === 0;
}

export function isNum(str: any) {
    if (!str) return false;
    return parseInt(str) == str ? true : false;
}