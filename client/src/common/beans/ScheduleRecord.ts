import {Time, TimeServerBean} from "../../core/utils/Time";

type TimeType = Time | null

export class ScheduleRecord {
    private startTime: TimeType
    private endTime: TimeType

    constructor(startTime: TimeType, endTime: TimeType) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public getStartTime(): TimeType {
        return this.startTime
    }

    public getEndTime(): TimeType {
        return this.endTime
    }

    public compareTo(second: ScheduleRecord): number {
        return this.startTime!.compareTo(second.startTime!)
    }

    public isBefore(second: ScheduleRecord): boolean {
        return this.endTime!.lessThan(second.startTime!)
    }

    public isAfter(second: ScheduleRecord): boolean {
        return this.startTime!.greaterThan(second.endTime!)
    }

    public intersects(second: ScheduleRecord): boolean {
        return !this.isBefore(second) && !this.isAfter(second)
    }

    public merge(second: ScheduleRecord): ScheduleRecord | null {
        if (!this.intersects(second)) {
            return null
        }

        const startTime = Time.min(this.startTime!, second.getStartTime()!)
        const endTime = Time.max(this.endTime!, second.endTime!)
        return new ScheduleRecord(startTime, endTime)
    }

    public static fromServerBean(bean: ScheduleRecordServerBean): ScheduleRecord {
        return new ScheduleRecord(Time.fromServerBean(bean.startTime), Time.fromServerBean(bean.endTime))
    }
}

export type ScheduleRecordServerBean = {
    startTime: TimeServerBean,
    endTime: TimeServerBean,
}