import {RemoteMethod} from "../http/RemoteMethod";
import HttpTransportError from "../errors/HttpTransportError";
import BusinessLogicError from "../errors/BusinessLogicError";
import {ErrorHandler} from "../mvc/ApplicationController";

const SERVER_APP_USER_ZONE_URL = "http://localhost:8080/web/user/req"
const SERVER_APP_PRELOGIN_ZONE_URL = "http://localhost:8080/web/login/req"

export async function fetchRpc(url: string,
                               method: RemoteMethod,
                               params: any[] | null = null,
                               id: number = 0): Promise<any> {
    const body = {
        method: method.getName(),
        params,
        id,
        jsonrpc: '2.0',
    }
    const response = fetch(url,
        {
            credentials: "include",
            method: "POST",
            body: JSON.stringify(body),
            cache: "no-cache",
            redirect: "follow",
            referrerPolicy: "no-referrer",
        })
    return parseResponseFromServer(response)
}

export async function fetchUserZoneRpc(data: FetchData): Promise<any> {
    return fetchServerRpc(SERVER_APP_USER_ZONE_URL,
        data.method,
        data.params,
        data.id,
        data.successCallback,
        data.errorHandler,
        data.setError)
}

export async function fetchPreloginRpc(data: FetchData): Promise<any> {
    return fetchServerRpc(SERVER_APP_PRELOGIN_ZONE_URL,
        data.method,
        data.params,
        data.id,
        data.successCallback,
        data.errorHandler,
        data.setError)
}

function fetchServerRpc(url: string,
                        method: RemoteMethod,
                        params: any[] | null = null,
                        id: number = 0,
                        successCallback: (responseResult: any) => void,
                        errorHandler: ErrorHandler,
                        setError: (errorType: string) => void = () => {
                        },): void {
    setError("")
    fetchRpc(url, method, params, id
    ).then(response => {
        successCallback(extractData(response))
    }).catch(e => {
        errorHandler.handle(e, setError)
    })
}

async function parseResponseFromServer(requestResult: Promise<Response>): Promise<any> {
    const response: Response = await requestResult
    if (!response.ok && response.status != 500) {
        throw new HttpTransportError(response.status, response.statusText)
    }
    return response.json()
}

export function extractData(responseJson: any): any {
    if (responseJson.error) {
        throw new BusinessLogicError(responseJson.error.message)
    }
    return responseJson.result
}

export type FetchData = {
    method: RemoteMethod,
    params?: any[] | null,
    id?: number,
    successCallback: (responseResult: any) => void,
    errorHandler: ErrorHandler,
    setError?: (errorType: string) => void
}