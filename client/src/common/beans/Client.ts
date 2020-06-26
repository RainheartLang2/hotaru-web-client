import {ClientType} from "./enums/ClientType";

export type Client = {
    id?: number
    firstName?: string
    middleName?: string
    lastName?: string
    type?: ClientType
    phone?: string
    address?: string
    email?: string
}
