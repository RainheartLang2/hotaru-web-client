import {DateUtils} from "../../core/utils/DateUtils";
import Time = DateUtils.Time;

export class ScheduleRecord {
    private _startTime: Time
    private _endTime: Time

    constructor(startTime: DateUtils.Time, endTime: DateUtils.Time) {
        this._startTime = startTime;
        this._endTime = endTime;
    }


    get startTime(): DateUtils.Time {
        return this._startTime;
    }

    get endTime(): DateUtils.Time {
        return this._endTime;
    }
}