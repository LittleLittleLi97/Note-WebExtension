export function isNum(str) {
    if (!str) return false;
    return parseInt(str) == str ? true : false;
}

export function isEmptyObj(obj) {
    if (Object.keys(obj).length === 0) {
        return true;
    }
    return false;
}