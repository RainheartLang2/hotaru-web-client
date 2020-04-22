import {RemoteMethod} from "../http/RemoteMethod";
import HttpTransportError from "../errors/HttpTransportError";
import BusinessLogicError from "../errors/BusinessLogicError";

const SERVER_APP_USER_ZONE_URL = "http://localhost:8080/web/user/req"
const SERVER_APP_PRELOGIN_ZONE_URL = "http://localhost:8080/web/login/req"

export async function fetchRpc(url: string,
                               method: RemoteMethod,
                               params: any[] | null = null,
                               id: number = 0) : Promise<any> {
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

export async function fetchUserZoneRpc(method: RemoteMethod, params: any[] | null = null, id: number = 0): Promise<any> {
    return fetchRpc(SERVER_APP_USER_ZONE_URL, method, params, id)
}

export async function fetchPreloginRpc(method: RemoteMethod, params: any[] | null = null, id: number = 0): Promise<any> {
    return fetchRpc(SERVER_APP_PRELOGIN_ZONE_URL, method, params, id)
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