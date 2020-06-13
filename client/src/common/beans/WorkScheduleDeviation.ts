import {DaySchedule, DayScheduleServerBean} from "./DaySchedule";

export class WorkScheduleDeviation {
    private startDate: Date
    private endDate: Date
    private changes: DaySchedule

    constructor(startDate: Date, endDate: Date, changes: DaySchedule) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.changes = changes;
    }

    public getStartDate(): Date {
        return this.startDate
    }

    public getEndDate(): Date {
        return this.endDate
    }

    public getChanges(): DaySchedule {
        return this.changes
    }

    public static fromServerBean(bean: WorkScheduleDeviationServerBean): WorkScheduleDeviation {
        return new WorkScheduleDeviation(new Date(bean.startDate), new Date(bean.endDate), DaySchedule.fromServerBean(bean.changes))
    }
}

export type WorkScheduleDeviationServerBean = {
    startDate: number
    endDate: number
    changes: DayScheduleServerBean
}