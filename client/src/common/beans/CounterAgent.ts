import Identifiable from "../../core/entities/Identifiable";
import {PersonType} from "./enums/PersonType";

export default class CounterAgent extends Identifiable {
    public name: string
    public personType: PersonType
    public phone: string
    public email: string

    public personFinancialId: string
    public bankName: string
    public bankId: string
    public correspondentAccount: string
    public gyroAccount: string
    public note: string

    constructor(bean: CounterAgentBean) {
        super(bean.id)
        this.name = bean.name
        this.personType = bean.personType
        this.phone = bean.phone
        this.email = bean.email
        this.personFinancialId = bean.personFinancialId
        this.bankName = bean.bankName
        this.bankId = bean.bankId
        this.correspondentAccount = bean.correspondentAccount
        this.gyroAccount = bean.gyroAccount
        this.note = bean.note
    }
}

export type CounterAgentBean = {
    id?: number
    name: string
    personType: PersonType
    phone: string
    email: string
    personFinancialId: string
    bankName: string
    bankId: string
    correspondentAccount: string
    gyroAccount: string
    note: string
}