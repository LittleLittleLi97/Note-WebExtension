export interface collect {
    id: string,
    name: string,
    children: Array<string>,
    createTime: string
}

export interface collectList {
    [id: string] : collect;
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

export interface BGrequest {
    type: string,
    func: string,
    params: [string, string?, string?]
}

export type DBReFunc = (storeName: string, indexName?: string, query?: string)=>any;