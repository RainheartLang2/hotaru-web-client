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
        data.errorCallback,
        data.errorProperty,
    )
}

export async function fetchPreloginRpc(data: FetchData, typedController: boolean = false): Promise<any> {
    return fetchServerRpc(SERVER_APP_PRELOGIN_ZONE_URL,
        data.method,
        data.params,
        data.id,
        data.successCallback,
        data.errorCallback,
        data.errorProperty,
        typedController
    )
}

function fetchServerRpc(url: string,
                        method: RemoteMethod,
                        params: any[] | null = null,
                        id: number = 0,
                        successCallback: (responseResult: any) => void,
                        errorCallback: Function = () => {},
                        errorProperty: string = "",
                        typedController: boolean = false
                        ): void {
    let setError = (value: string) => {}
    if (!typedController) {
        const controller = ApplicationControllerHolder.instance.controller
        setError = errorProperty
            ? (value: string) => {controller.setPropertyValue<String>(errorProperty, value)}
            : (value: string) => {}
    }

    setError("")
    fetchRpc(url, method, params, id
    ).then(response => {
        successCallback(extractData(response))
    }).catch(e => {
        handleError(e, setError)
        errorCallback(e)
    })
}

const HANDLED_HTTP_CODES = [404, 500]

function handleError(e: any, setError: (errorType: string) => void): void {
    if (e instanceof BusinessLogicError) {
        setError(e.message)
        return
    }
    const controller = ApplicationControllerHolder.instance.controller
    let errorMessageKey = "error.message.unknown"
    if (e instanceof HttpTransportError) {
        if (e.code == 401) {
            controller.handleUnauthorizedUserSituation()
            return
        }
        errorMessageKey = "error.message.http." + (HANDLED_HTTP_CODES.includes(e.code) ? e.code : "common")
    }

    controller.setGlobalApplicationError(errorMessageKey)
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
    errorCallback?: Function
    errorProperty?: string,
}