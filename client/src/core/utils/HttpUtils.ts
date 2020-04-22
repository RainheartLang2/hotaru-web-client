import {RemoteMethod} from "../http/RemoteMethod";
import HttpTransportError from "../errors/HttpTransportError";
import BusinessLogicError from "../errors/BusinessLogicError";
import ApplicationControllerHolder from "./ApplicationControllerHolder";

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
        data.setError)
}

export async function fetchPreloginRpc(data: FetchData): Promise<any> {
    return fetchServerRpc(SERVER_APP_PRELOGIN_ZONE_URL,
        data.method,
        data.params,
        data.id,
        data.successCallback,
        data.setError)
}

function fetchServerRpc(url: string,
                        method: RemoteMethod,
                        params: any[] | null = null,
                        id: number = 0,
                        successCallback: (responseResult: any) => void,
                        setError: (errorType: string) => void = () => {
                        },): void {
    setError("")
    fetchRpc(url, method, params, id
    ).then(response => {
        successCallback(extractData(response))
    }).catch(e => {
        handleError(e, setError)
    })
}

const HANDLED_HTTP_CODES = [404, 500]

function handleError(e: any, setError: (errorType: string) => void): void {
    if (e instanceof BusinessLogicError) {
        setError(e.message)
        return
    }
    let errorMessageKey = "error.message.unknown"
    if (e instanceof HttpTransportError) {
        errorMessageKey = "error.message.http." + (HANDLED_HTTP_CODES.includes(e.code) ? e.code : "common")
    }

    ApplicationControllerHolder.instance.controller.setGlobalApplicationError(errorMessageKey)
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
    setError?: (errorType: string) => void
}