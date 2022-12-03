export function copyObjToReactive(reactive: any, obj: any) {
    for (const key in obj) {
        reactive[key] = obj[key];
    }
}