import {ClientType} from "./enums/ClientType";

export type Client = {
    id?: number
    firstName?: string
    type?: ClientType
    phone?: string
    address?: string
    email?: string
}
