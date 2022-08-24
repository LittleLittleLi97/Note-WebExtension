export function isNum(str) {
    if (!str) return false;
    return parseInt(str) == str ? true : false;
}