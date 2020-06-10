import {DaySchedule, DayScheduleServerBean} from "./DaySchedule";
import {ScheduleRecord} from "./ScheduleRecord";
import {CollectionUtils} from "../../core/utils/CollectionUtils";
import cloneArray = CollectionUtils.cloneArray;
import {plainToClass} from "class-transformer";

export default class WorkSchedule {
    private _length: number
    _schedule: DaySchedule[]


    constructor(length: number, schedule?: DaySchedule[]) {
        if (schedule && length != schedule.length) {
            throw new Error("length is " + length + ", schedule length is " + schedule.length)
        }
        this._length = length
        this._schedule = schedule
                            ? schedule
                            : CollectionUtils.fillArray(length, new DaySchedule([]))
    }

    public get length(): number {
        return this._length;
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
        return new WorkSchedule(this.length, newSchedule)
    }

    public static fromServerBean(bean: WorkScheduleServerBean): WorkSchedule {
        return new WorkSchedule(bean.length, bean.schedule.map(daySchedule => DaySchedule.fromServerBean(daySchedule)))
    }
}

export type WorkScheduleServerBean = {
    length: number
    schedule: DayScheduleServerBean[]
}
