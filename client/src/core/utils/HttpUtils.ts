import {ServerAppUrl, GetMethod, HttpMethod} from "../http/ServerAppUrl";
import {httpclient} from "typescript-http-client";

const SERVER_APP_URL = "http://localhost:8080/web"
const URL_AND_PARAMETERS_SEPARATOR = "?"
const PARAMETER_SEPARATOR = "&"

export async function fetchHttpGet(url: string, parameters?: string[]): Promise<Response> {
    return fetch(buildUrlWithParams(url, parameters))
}

export async function fetchHttpPost(url: string, jsonData: string) {
    // const headers: Headers = new Headers()
    // headers.append("Content-Type", "application/json")
    // const stream: ReadableStream = new ReadableStream(jsonData)
    // const request: RequestInfo = {
    //     url: buildUrlWithParams(url, []),
    //     method: "POST",
    //     mode: "cors",
    //     cache: "no-cache",
    //     headers: new Headers(),
    //     redirect: "follow",
    //     referrerPolicy: "no-referrer",
    //     body: stringToStream(jsonData),
    // }
    //
    // return fetch(buildUrlWithParams(url, []),
    //     )
}

export async function sendGetRequestToServer(url: ServerAppUrl<GetMethod>, parameters?: string[]): Promise<Response> {
    //TODO: function should return Promise with JSON instead of response
    return fetchHttpGet(buildServerAppUrl(url, parameters))
}

function buildServerAppUrl(url: ServerAppUrl<HttpMethod>, parameters?: string[]): string {
    return buildUrlWithParams(SERVER_APP_URL + url.getUrl(), parameters)
}

export function buildUrlWithParams(url: string, parameters?: string[]): string {
    let result: string = url
    if (parameters) {
        result += URL_AND_PARAMETERS_SEPARATOR + parameters.join(PARAMETER_SEPARATOR)
    }
    return result
}