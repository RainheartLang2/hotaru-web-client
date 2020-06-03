import {DaySchedule} from "./DaySchedule";

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
}