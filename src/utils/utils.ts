export function copyObjToReactive(reactive: any, obj: any) {
    for (const key in obj) {
        reactive[key] = obj[key];
    }
}

export function reactiveToObj(reactive: object) {
    return JSON.parse(JSON.stringify(reactive));
}