import {RemoteMethod} from "../http/RemoteMethod";
import HttpTransportError from "../errors/HttpTransportError";

const SERVER_APP_AUTHORIZED_URL = "http://localhost:8080/web/user/req"
const SERVER_APP_UNAUTHORIZED_URL = "http://localhost:8080/web/login/req"

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

export async function fetchAuthorizedRpc(method: RemoteMethod, params: any[] | null = null, id: number = 0): Promise<any> {
    return fetchRpc(SERVER_APP_AUTHORIZED_URL, method, params, id)
}

export async function fetchUnauthorizedRpc(method: RemoteMethod, params: any[] | null = null, id: number = 0): Promise<any> {
    return fetchRpc(SERVER_APP_UNAUTHORIZED_URL, method, params, id)
}

async function parseResponseFromServer(requestResult: Promise<Response>): Promise<any> {
    const response: Response = await requestResult
    console.log(response)
    if (!response.ok) {
        throw new HttpTransportError(response.status, response.statusText)
    }
    return response.json()
}

export function extractData(responseJson: any): any {
    return responseJson.result
}