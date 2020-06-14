import WorkSchedule, {WorkScheduleServerBean} from "./WorkSchedule";
import Identifiable from "../../core/entities/Identifiable";
import {ScheduleRecord} from "./ScheduleRecord";
import ClinicsWorkScheduleNode from "../../admin/state/nodes/ClinicsWorkScheduleNode";

export class ClinicWorkSchedule extends Identifiable {
    private _clinicId?: number
    private _default: boolean
    private _usesDefault: boolean
    private _schedule: WorkSchedule

    constructor(id: number | undefined, schedule: WorkSchedule, _default: boolean, _usesDefault: boolean, clinicId?: number) {
        super(id)
        this._default = _default
        this._usesDefault = _usesDefault
        this._clinicId = clinicId;
        this._schedule = schedule;
    }


    get clinicId(): number | undefined {
        return this._clinicId;
    }

    get schedule(): WorkSchedule {
        return this._schedule;
    }

    get usesDefault(): boolean {
        return this._usesDefault;
    }

    public setDaySchedule(dayNum: number, records: ScheduleRecord[]): ClinicWorkSchedule {
        return new ClinicWorkSchedule(this.id, this.schedule.setSchedule(dayNum, records), this._default, this._usesDefault, this._clinicId)
    }

    public setUsesDefault(usesDefault: boolean): ClinicWorkSchedule {
        return new ClinicWorkSchedule(this.id, this.schedule, this._default, usesDefault, this.clinicId)
    }

    public isDefault(): boolean {
        return this._default
    }

    public makeDefaultWorkSchedule(): ClinicWorkSchedule {
        return new ClinicWorkSchedule(this.id, this.schedule, true, false, ClinicsWorkScheduleNode.getDefaultWorkSchedule().id)
    }

    public static fromServerBean(bean: ClinicWorkScheduleServerBean): ClinicWorkSchedule {
        const schedule = bean.schedule
                            ? WorkSchedule.fromServerBean(bean.schedule!)
                            : new WorkSchedule(7, [])
        const clinicId = bean.defaultSchedule
                            ? ClinicsWorkScheduleNode.getDefaultWorkSchedule().id
                            : bean.clinicId
        return new ClinicWorkSchedule(bean.id, schedule, bean.defaultSchedule, bean.usesDefault, clinicId)
    }
}

export type ClinicWorkScheduleServerBean = {
    clinicId?: number
    defaultSchedule: boolean
    id: number
    schedule?: WorkScheduleServerBean
    usesDefault: boolean
}