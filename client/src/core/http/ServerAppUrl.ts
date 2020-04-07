export class ServerAppUrl<M extends HttpMethod>{
    private service: ServerAppService
    private action: ServerAppAction

    constructor(service: ServerAppService, action: ServerAppAction) {
        this.service = service;
        this.action = action;
    }

    public getUrl() {
        return this.service.getUrl() + this.action.getUrl()
    }
}

export interface HttpMethod {}
export interface GetMethod extends HttpMethod {}
export interface PostMethod extends HttpMethod {}
export interface DeleteMethod extends HttpMethod {}

export class ServerAppService {
    private url: string

    constructor(url: string) {
        this.url = url;
    }

    getUrl(): string {
        return this.url
    }
}

export class ServerAppAction {
    private url: string

    constructor(url: string) {
        this.url = url;
    }

    getUrl(): string {
        return this.url
    }
}