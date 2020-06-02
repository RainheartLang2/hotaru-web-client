import {ScheduleRecord} from "./ScheduleRecord";

export class DaySchedule {
    private _records: ScheduleRecord[]

    constructor(timePeriods: ScheduleRecord[]) {
        this._records = timePeriods;
    }

    get records(): ScheduleRecord[] {
        return this._records;
    }
}