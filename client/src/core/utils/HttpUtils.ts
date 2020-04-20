import {RemoteMethod} from "../http/RemoteMethod";
import {RpcClient} from "jsonrpc-ts";
import {AxiosResponse} from 'axios';

const SERVER_APP_URL = "http://localhost:8080/web"

const rpcClient = new RpcClient({ url: SERVER_APP_URL})

export async function fetchRpc(method: RemoteMethod, params: any[] | null = null, id: number = 0): Promise<AxiosResponse> {
    return rpcClient.makeRequest({
        method: method.getName(),
        params,
        id,
        jsonrpc: '2.0',
    })
}

export function extractData(response: AxiosResponse): string {
    return response.data.result
}