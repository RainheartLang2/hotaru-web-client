import {ScheduleRecord} from "./ScheduleRecord";
import {DateUtils} from "../../core/utils/DateUtils";

export class DaySchedule {
    private _records: ScheduleRecord[]

    constructor(timePeriods: ScheduleRecord[]) {
        this._records = DateUtils.mergeTimeRangesSequence(timePeriods)
    }

    get records(): ScheduleRecord[] {
        return this._records;
    }

    public isWholeDayLong(): boolean {
        if (this.records.length != 1) {
            return false
        }

        const firstRecord = this.records[0]
        return firstRecord.startTime.hours == 0 && firstRecord.startTime.minutes == 0
                && firstRecord.endTime.hours == 23 && firstRecord.endTime.minutes == 59
    }
}