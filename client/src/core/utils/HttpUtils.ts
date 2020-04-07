import {ServerAppUrl, GetMethod, HttpMethod, PostMethod} from "../http/ServerAppUrl";
import {httpclient} from "typescript-http-client";

const SERVER_APP_URL = "http://localhost:8080/web"
const URL_AND_PARAMETERS_SEPARATOR = "?"
const PARAMETER_SEPARATOR = "&"

export async function fetchHttpGet(url: string, parameters?: string[]): Promise<Response> {
    return fetch(buildUrlWithParams(url, parameters))
}

export async function fetchHttpPost(url: string, jsonData: string): Promise<Response> {
    const headers: Headers = new Headers()
    headers.append("Content-Type", "application/json")

    return fetch(buildUrlWithParams(url, []),
        {
            method: "POST",
            body: jsonData,
            mode: "cors",
            cache: "no-cache",
            headers: headers,
            redirect: "follow",
            referrerPolicy: "no-referrer",
        }
    )
}

export async function sendGetRequestToServer(url: ServerAppUrl<GetMethod>, parameters?: string[]): Promise<Response> {
    //TODO: function should return Promise with JSON instead of response
    return fetchHttpGet(buildServerAppUrl(url, parameters))
}

export async function sendPostRequestToServer(url: ServerAppUrl<PostMethod>, json: string) {
    return fetchHttpPost(buildServerAppUrl(url), json)
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