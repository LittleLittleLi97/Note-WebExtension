export interface collect {
    id: string,
    name: string,
    children: Array<string>,
    createTime: number
}

export interface collectList {
    [id: string] : collect
}

export interface note {
    id: string,
    collect_id: string,
    title: string,
    url: string,
    url_icon: string,
    content: string,
    children: Array<string>
}

export interface cell {
    id: string,
    collect_id: string,
    note_id: string,
    content: string,
    label: string,
    highlight: boolean
}

export interface highlightInterface {
    url: string,
    area: {
        [key: string] : string
    }
}

export interface cellList {
    [id: string] : cell
}

export interface domObj {
    [key: string]: HTMLElement
}

export interface BGrequest {
    type: string,
    func: string,
    params: [string, string?, string?]
}

export type DBReFunc = (storeName: string, indexName?: string, query?: string)=>any;

export interface showControlFuncObj {
    showNote: ()=>void,
    closeNote: ()=>void
};