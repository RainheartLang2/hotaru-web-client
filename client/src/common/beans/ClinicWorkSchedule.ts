import WorkSchedule from "./WorkSchedule";
import Identifiable from "../../core/entities/Identifiable";
import {ScheduleRecord} from "./ScheduleRecord";

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
}