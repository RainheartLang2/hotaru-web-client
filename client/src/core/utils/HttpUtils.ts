import {ServerAppUrl, GetMethod, HttpMethod, PostMethod, DeleteMethod} from "../http/ServerAppUrl";
import {httpclient} from "typescript-http-client";

const SERVER_APP_URL = "http://localhost:8080/web"
const URL_AND_PARAMETERS_SEPARATOR = "?"
const PARAMETER_SEPARATOR = "&"

export async function fetchHttpGet(url: string, parameters?: RequestParameter[]): Promise<Response> {
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

export async function fetchHttpDelete(url: string, parameters?: RequestParameter[]): Promise<Response> {
    return fetch(buildUrlWithParams(url, parameters),
        {
            method: "DELETE",
        })
}

export async function sendGetRequestToServer(url: ServerAppUrl<GetMethod>, parameters?: RequestParameter[]): Promise<Response> {
    //TODO: function should return Promise with JSON instead of response
    return fetchHttpGet(buildServerAppUrl(url, parameters))
}

export async function sendPostRequestToServer(url: ServerAppUrl<PostMethod>, json: string) {
    return fetchHttpPost(buildServerAppUrl(url), json)
}

export async function sendDeleteRequestToServer(url: ServerAppUrl<DeleteMethod>, parameters: RequestParameter[]): Promise<Response> {
    return fetchHttpDelete(buildServerAppUrl(url, parameters))
}

function buildServerAppUrl(url: ServerAppUrl<HttpMethod>, parameters?: RequestParameter[]): string {
    return buildUrlWithParams(SERVER_APP_URL + url.getUrl(), parameters)
}

export function buildUrlWithParams(url: string, parameters?: RequestParameter[]): string {
    let result: string = url
    if (parameters) {
        result += URL_AND_PARAMETERS_SEPARATOR
        result += parameters
                    .map(parameter => `${parameter.name}=${parameter.value}`)
                    .join(PARAMETER_SEPARATOR)
    }
    return result
}

export type RequestParameter = {
    name: string,
    value: string | number | boolean,
}