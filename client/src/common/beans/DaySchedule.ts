import {ScheduleRecord, ScheduleRecordServerBean} from "./ScheduleRecord";
import {DateUtils} from "../../core/utils/DateUtils";
import {Time} from "../../core/utils/Time";

export class DaySchedule {
    private records: ScheduleRecord[]

    constructor(timePeriods: ScheduleRecord[]) {
        this.records = DateUtils.mergeTimeRangesSequence(timePeriods)
    }

    public getRecords(): ScheduleRecord[] {
        return this.records
    }

    public isWholeDayLong(): boolean {
        if (this.records.length != 1) {
            return false
        }

        const firstRecord = this.records[0]

        const startTime = firstRecord.getStartTime()
        const endTime = firstRecord.getEndTime()
        if (!startTime || !endTime) {
            return false
        }
        return startTime.getHours() == 0 && startTime.getMinutes() == 0
                && endTime.getHours() == 23 && endTime.getMinutes() == 59
    }

    public getMinTime(): Time | null {
        if (this.records.length == 0) {
            return null
        }
        return this.records[0].getStartTime()
    }

    public getMaxTime(): Time | null {
        if (this.records.length == 0) {
            return null
        }
        return this.records[this.records.length - 1].getEndTime()
    }

    public static fromServerBean(bean: DayScheduleServerBean): DaySchedule {
        return new DaySchedule(bean.records.map(record => ScheduleRecord.fromServerBean(record)))
    }
}

export type DayScheduleServerBean = {
    records: ScheduleRecordServerBean[]
}