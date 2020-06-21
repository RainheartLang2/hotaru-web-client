import {WorkScheduleDeviation, WorkScheduleDeviationServerBean} from "./WorkScheduleDeviation";
import Identifiable from "../../core/entities/Identifiable";
import {ScheduleRecord} from "./ScheduleRecord";
import {DaySchedule, DayScheduleServerBean} from "./DaySchedule";
import {AppointmentModel} from "@devexpress/dx-react-scheduler";
import {DateUtils} from "../../core/utils/DateUtils";

export class WorkScheduleDeviationContainer extends Identifiable {
    private type: DeviationType
    private name: string
    private workScheduleId?: number

    private startDate: Date
    private endDate: Date
    private changes: DaySchedule

    constructor(
        type: DeviationType,
        id: number | undefined,
        name: string,
        startDate: Date,
        endDate: Date,
        changes: DaySchedule,
        workScheduleId?: number
    ) {
        super(id)
        this.type = type
        this.name = name;
        this.workScheduleId = workScheduleId;
        this.startDate = startDate
        this.endDate = endDate
        this.changes = changes
    }

    public getWorkScheduleId(): number | undefined {
        return this.workScheduleId
    }

    public isGlobal(): boolean {
        return !this.workScheduleId
    }

    public getName(): string {
        return this.name
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

    public setDates(startDate: Date, endDate: Date): WorkScheduleDeviationContainer {
        return new WorkScheduleDeviationContainer(this.type, this.id, this.name,
            startDate, endDate, this.getChanges(), this.workScheduleId)
    }

    public static createClinicDeviation(
        id: number | undefined,
        name: string,
        startDate: Date,
        endDate: Date,
        records: ScheduleRecord[],
        workScheduleId?: number
    ) : WorkScheduleDeviationContainer {
        return new WorkScheduleDeviationContainer(DeviationType.Clinic, id, name, startDate, endDate, new DaySchedule(records), workScheduleId)
    }

    public static createEmployeeDeviation(
        id: number | undefined,
        name: string,
        startDate: Date,
        endDate: Date,
        records: ScheduleRecord[],
        workScheduleId?: number
    ) : WorkScheduleDeviationContainer {
        return new WorkScheduleDeviationContainer(DeviationType.Employee, id, name, startDate, endDate, new DaySchedule(records), workScheduleId)
    }


    public static fromServerBean(bean: WorkScheduleDeviationContainerServerBean) {
        return new WorkScheduleDeviationContainer(
            bean.type,
            bean.id,
            bean.name,
            new Date(bean.startDate),
            new Date(bean.endDate),
            DaySchedule.fromServerBean(bean.changes),
            bean.workScheduleId,
        )
    }

    public toAppointmentModel(): AppointmentModel {
        return {
            id: this.id,
            title: this.getName(),
            startDate: this.getStartDate(),
            endDate: DateUtils.getNextDay(this.getEndDate())
        }
    }
}

export type WorkScheduleDeviationContainerServerBean = {
    id: number,
    type: DeviationType,
    name: string,
    workScheduleId?: number,
    deviationData: WorkScheduleDeviationServerBean,
    startDate: number
    endDate: number
    changes: DayScheduleServerBean
}

enum DeviationType {
    Clinic,
    Employee
}