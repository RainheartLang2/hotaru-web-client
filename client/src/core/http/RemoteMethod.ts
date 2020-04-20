export class RemoteMethod{
    private service: ServerAppService
    private action: ServerAppAction

    constructor(service: ServerAppService, action: ServerAppAction) {
        this.service = service;
        this.action = action;
    }

    public getName() {
        return this.service.name + "." + this.action.name
    }
}

export class ServerAppService {
    private _name: string

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name
    }
}

export class ServerAppAction {
    private _name: string

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name
    }
}