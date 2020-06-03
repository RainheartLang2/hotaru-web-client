import WorkSchedule from "./WorkSchedule";
import Identifiable from "../../core/entities/Identifiable";

export class ClinicWorkSchedule extends Identifiable {
    private _clinicId?: number
    private _default: boolean
    private _schedule: WorkSchedule


    constructor(id: number, schedule: WorkSchedule, _default: boolean, clinicId: number ) {
        super(id)
        this._default = _default
        this._clinicId = clinicId;
        this._schedule = schedule;
    }


    get clinicId(): number | undefined {
        return this._clinicId;
    }

    get schedule(): WorkSchedule {
        return this._schedule;
    }
}