export function removeUrlQuery(url) {
    const obj = new URL(url);
    return obj.origin + obj.pathname;
}