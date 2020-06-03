import {DateUtils} from "../../core/utils/DateUtils";
import {Time} from "../../core/utils/Time";

export class ScheduleRecord {
    private _startTime: Time
    private _endTime: Time

    constructor(startTime: Time, endTime: Time) {
        this._startTime = startTime;
        this._endTime = endTime;
    }

    get startTime(): Time {
        return this._startTime;
    }

    get endTime(): Time {
        return this._endTime;
    }

    public compareTo(second: ScheduleRecord): number {
        return this._startTime.compareTo(second.startTime)
    }

    public isBefore(second: ScheduleRecord): boolean {
        return this.endTime.lessThan(second.startTime)
    }

    public isAfter(second: ScheduleRecord): boolean {
        return this.startTime.greaterThan(second.endTime)
    }

    public intersects(second: ScheduleRecord): boolean {
        return !this.isBefore(second) && !this.isAfter(second)
    }

    public merge(second: ScheduleRecord): ScheduleRecord | null {
        if (!this.intersects(second)) {
            return null
        }

        const startTime = Time.min(this.startTime, second.startTime)
        const endTime = Time.max(this.endTime, second.endTime)
        return new ScheduleRecord(startTime, endTime)
    }
}