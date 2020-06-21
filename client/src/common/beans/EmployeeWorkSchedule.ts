import Identifiable from "../../core/entities/Identifiable";
import WorkSchedule, {WorkScheduleServerBean} from "./WorkSchedule";
import {ScheduleRecord} from "./ScheduleRecord";
import ClinicsWorkScheduleNode from "../../admin/state/nodes/ClinicsWorkScheduleNode";
import {ClinicWorkScheduleServerBean} from "./ClinicWorkSchedule";
import EmployeeWorkScheduleNode from "../../admin/state/nodes/EmployeeWorkScheduleNode";
import {DaySchedule} from "./DaySchedule";
import {DateUtils} from "../../core/utils/DateUtils";

export default class EmployeeWorkSchedule extends Identifiable {
    private employeeId?: number
    private defaultSchedule: boolean
    private usesDefault: boolean
    private schedule: WorkSchedule
    private startDate?: Date
    private endDate?: Date

    constructor(id: number | undefined, employeeId: number | undefined, isDefault: boolean, usesDefault: boolean, schedule: WorkSchedule,
                startDate?: Date, endDate?: Date
    ) {
        super(id)
        this.employeeId = employeeId
        this.defaultSchedule = isDefault
        this.usesDefault = usesDefault
        this.schedule = schedule
        this.startDate = startDate
        this.endDate = endDate
    }

    public getEmployeeId(): number | undefined {
        return this.employeeId
    }

    public isDefaultSchedule(): boolean {
        return this.defaultSchedule
    }

    public isUsesDefault(): boolean {
        return this.usesDefault
    }

    public getWorkSchedule(): WorkSchedule {
        return this.schedule
    }

    public getStartDate(): Date | undefined {
        return this.startDate
    }

    public getEndDate(): Date | undefined {
        return this.endDate
    }

    public setUsesDefault(value: boolean): EmployeeWorkSchedule {
        return new EmployeeWorkSchedule(this.id, this.employeeId, this.defaultSchedule, value, this.schedule)
    }

    public setDaySchedule(day: number, records: ScheduleRecord[]): EmployeeWorkSchedule {
        return new EmployeeWorkSchedule(this.id, this.employeeId, this.defaultSchedule, this.usesDefault, this.schedule.setSchedule(day, records))
    }

    public setLength(length: number): EmployeeWorkSchedule {
        return new EmployeeWorkSchedule(this.id, this.employeeId, this.defaultSchedule, this.usesDefault, this.schedule.setLength(length))
    }

    public setWeekly(): EmployeeWorkSchedule {
        return new EmployeeWorkSchedule(this.id, this.employeeId, this.defaultSchedule, this.usesDefault, this.schedule.setWeekly())
    }

    public static fromServerBean(bean: EmployeeWorkScheduleServerBean): EmployeeWorkSchedule {
        const schedule = bean.schedule
            ? WorkSchedule.fromServerBean(bean.schedule!)
            : new WorkSchedule(7, true,)
        const employeeId = bean.defaultSchedule
            ? EmployeeWorkScheduleNode.getDefaultWorkSchedule().id
            : bean.employeeId
        return new EmployeeWorkSchedule(
            bean.id,
            employeeId,
            bean.defaultSchedule,
            bean.usesDefault,
            schedule,
            bean.startDate ? new Date(bean.startDate) : undefined,
            bean.endDate ? new Date(bean.endDate) : undefined,
        )
    }

    public getDayScheduleForDate(date: Date): DaySchedule {
        if (this.usesDefault) {
            throw new Error("DaySchedule can not be calculated. This schedule uses default.")
        }

        if (this.getWorkSchedule().isWeekly()) {
            return this.getWorkSchedule().getSchedule(date.getDay())
        }

        if (!this.startDate) {
            throw new Error("schedule has no start date to calculate daySchedule")
        }

        const difference = DateUtils.getDifferenceInDays(this.startDate, date)

        if (difference < 0) {
            throw new Error("date is greater than startDate")
        }

        return this.getWorkSchedule().getSchedule(difference % this.getWorkSchedule().length)
    }

    // public DaySchedule getDayScheduleForDate(Date startDate, Date date) {
    // if (this.weekly) {
    // return this.schedule.get(date.getDay());
    // }
    //
    // long difference = DateHelper.getDifferenceInDays(startDate, date);
    // if (difference < 0) {
    // return null;
    // }
    // int index = (int) (difference % this.length);
    // return this.schedule.get(index);
    // }
}

export type EmployeeWorkScheduleServerBean = {
    employeeId?: number
    defaultSchedule: boolean
    id: number
    schedule?: WorkScheduleServerBean
    usesDefault: boolean
    startDate?: Date
    endDate?: Date
}