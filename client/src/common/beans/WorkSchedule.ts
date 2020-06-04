import {DaySchedule} from "./DaySchedule";
import {ScheduleRecord} from "./ScheduleRecord";
import {CollectionUtils} from "../../core/utils/CollectionUtils";

export default class WorkSchedule {
    private _length: number
    _schedule: Map<number, DaySchedule>


    constructor(length: number, schedule: Map<number, DaySchedule>) {
        this._length = length;
        this._schedule = schedule;
    }

    public get length(): number {
        return this._length;
    }

    public getSchedule(num: number): DaySchedule {
        if (num >= this.length) {
            throw new Error("attempted retrieving of schedule with number " + num + ", while length is " + this.length)
        }

        const schedule = this._schedule.get(num)
        if (!schedule) {
            return new DaySchedule([])
        }
        return schedule
    }

    public setSchedule(num: number, records: ScheduleRecord[]): WorkSchedule {
        if (num >= this.length) {
            throw new Error("attempted retrieving of schedule with number " + num + ", while length is " + this.length)
        }

        const newMap = CollectionUtils.cloneMap(this._schedule)
        newMap.set(num, new DaySchedule(records))
        return new WorkSchedule(this.length, newMap)
    }
}