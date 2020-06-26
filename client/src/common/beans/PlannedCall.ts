import Identifiable from "../../core/entities/Identifiable";
import {PlannedCallStateType} from "./enums/PlannedCallStateType";

export default class extends Identifiable {
    state: PlannedCallStateType
    clinicId: number
    doctorId: number
    clientId: number
    petId: number | null
    callDate: Date
    note: string


    constructor(plain: PlainPlannedCall) {
        super(plain.id);
        this.state = plain.state;
        this.clinicId = plain.clinicId;
        this.doctorId = plain.doctorId;
        this.clientId = plain.clientId;
        this.petId = plain.petId;
        this.callDate = plain.callDate;
        this.note = plain.note;
    }
}

export type PlainPlannedCall = {
    id?: number
    state: PlannedCallStateType
    clinicId: number
    doctorId: number
    clientId: number
    petId: number | null
    callDate: Date
    note: string

}