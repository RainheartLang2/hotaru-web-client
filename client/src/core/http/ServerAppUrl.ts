export class ServerAppUrl<M extends HttpMethod>{
    private service: ServerAppService
    private action: ServerAppAction

    constructor(service: ServerAppService, action: ServerAppAction) {
        this.service = service;
        this.action = action;
    }

    public getUrl() {
        return this.service.url + this.action.url
    }
}

export interface HttpMethod {}
export interface GetMethod extends HttpMethod {}
export interface PostMethod extends HttpMethod {}
export interface DeleteMethod extends HttpMethod {}

export class ServerAppService {
    private _url: string

    constructor(url: string) {
        this._url = url;
    }

    get url(): string {
        return this._url
    }
}

export class ServerAppAction {
    private _url: string

    constructor(url: string) {
        this._url = url;
    }

    get url(): string {
        return this._url
    }
}