import Identifiable from "../../core/entities/Identifiable";
import WorkSchedule, {WorkScheduleServerBean} from "./WorkSchedule";
import {ScheduleRecord} from "./ScheduleRecord";
import ClinicsWorkScheduleNode from "../../admin/state/nodes/ClinicsWorkScheduleNode";
import {ClinicWorkScheduleServerBean} from "./ClinicWorkSchedule";
import EmployeeWorkScheduleNode from "../../admin/state/nodes/EmployeeWorkScheduleNode";

export default class EmployeeWorkSchedule extends Identifiable {
    private employeeId?: number
    private defaultSchedule: boolean
    private usesDefault: boolean
    private schedule: WorkSchedule

    constructor(id: number | undefined, employeeId: number | undefined, isDefault: boolean, usesDefault: boolean, schedule: WorkSchedule) {
        super(id)
        this.employeeId = employeeId
        this.defaultSchedule = isDefault
        this.usesDefault = usesDefault
        this.schedule = schedule
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
        return new EmployeeWorkSchedule(bean.id, employeeId, bean.defaultSchedule, bean.usesDefault, schedule)
    }
}

export type EmployeeWorkScheduleServerBean = {
    employeeId?: number
    defaultSchedule: boolean
    id: number
    schedule?: WorkScheduleServerBean
    usesDefault: boolean
}