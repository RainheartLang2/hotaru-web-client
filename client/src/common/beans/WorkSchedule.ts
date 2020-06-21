import {DaySchedule, DayScheduleServerBean} from "./DaySchedule";
import {ScheduleRecord} from "./ScheduleRecord";
import {CollectionUtils} from "../../core/utils/CollectionUtils";
import cloneArray = CollectionUtils.cloneArray;

export default class WorkSchedule {
    private _length: number
    private weekly: boolean
    private _schedule: DaySchedule[]
    private startDate: Date


    constructor(length: number, weekly?: boolean, startDate?: Date,  schedule?: DaySchedule[]) {
        if (weekly) {
            length = 7
        }
        this.weekly = !!weekly
        if (schedule && length != schedule.length) {
            throw new Error("length is " + length + ", schedule length is " + schedule.length)
        }
        this.startDate = startDate ? startDate : new Date()
        this._length = length
        this._schedule = schedule
                            ? schedule
                            : CollectionUtils.fillArray(length, new DaySchedule([]))
    }

    public get length(): number {
        return this._length;
    }

    public isWeekly(): boolean {
        return this.weekly
    }

    public getStartDate(): Date {
        return this.startDate
    }

    public getSchedule(num: number): DaySchedule {
        if (num >= this.length) {
            throw new Error("attempted retrieving of schedule with number " + num + ", while length is " + this.length)
        }

        const schedule = this._schedule[num]
        if (!schedule) {
            return new DaySchedule([])
        }
        return schedule
    }

    public setSchedule(num: number, records: ScheduleRecord[]): WorkSchedule {
        if (num >= this.length) {
            throw new Error("attempted retrieving of schedule with number " + num + ", while length is " + this.length)
        }

        const newSchedule = cloneArray(this._schedule)
        newSchedule[num] = new DaySchedule(records)
        return new WorkSchedule(this.length, this.weekly, this.startDate, newSchedule)
    }

    public setLength(length: number): WorkSchedule {
        return new WorkSchedule(length, false, this.startDate, CollectionUtils.fillArray(length, new DaySchedule([])))
    }

    public setWeekly(): WorkSchedule {
        return new WorkSchedule(7, true, this.startDate)
    }

    public static fromServerBean(bean: WorkScheduleServerBean): WorkSchedule {
        return new WorkSchedule(bean.length, bean.weekly, bean.startDate, bean.schedule.map(daySchedule => DaySchedule.fromServerBean(daySchedule)))
    }
}

export type WorkScheduleServerBean = {
    length: number
    startDate: Date
    weekly: boolean
    schedule: DayScheduleServerBean[]
}

type CalendaricPeriod = {
    calendaric: "weekly"
}

type StrictPeriod = {
    length: number
}

type PeriodType = StrictPeriod | CalendaricPeriod