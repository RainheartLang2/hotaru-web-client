import {WorkScheduleDeviation, WorkScheduleDeviationServerBean} from "./WorkScheduleDeviation";
import Identifiable from "../../core/entities/Identifiable";
import {ScheduleRecord} from "./ScheduleRecord";
import {DaySchedule} from "./DaySchedule";
import {AppointmentModel} from "@devexpress/dx-react-scheduler";
import {DateUtils} from "../../core/utils/DateUtils";

export class WorkScheduleDeviationContainer extends Identifiable {
    private type: DeviationType
    private name: string
    private workScheduleId?: number
    private deviationData: WorkScheduleDeviation

    constructor(type: DeviationType, id: number | undefined, name: string, deviationData: WorkScheduleDeviation, workScheduleId?: number) {
        super(id)
        this.type = type
        this.name = name;
        this.workScheduleId = workScheduleId;
        this.deviationData = deviationData;
    }

    public getWorkScheduleId(): number | undefined {
        return this.workScheduleId
    }

    public isGlobal(): boolean {
        return !this.workScheduleId
    }

    public getDeviationData(): WorkScheduleDeviation {
        return this.deviationData
    }

    public getName(): string {
        return this.name
    }

    public setDates(startDate: Date, endDate: Date): WorkScheduleDeviationContainer {
        return new WorkScheduleDeviationContainer(this.type, this.id, this.name,
            new WorkScheduleDeviation(startDate, endDate, this.deviationData.getChanges()), this.workScheduleId)
    }

    public static createClinicDeviation(
        id: number | undefined,
        name: string,
        startDate: Date,
        endDate: Date,
        records: ScheduleRecord[],
        workScheduleId?: number
    ) : WorkScheduleDeviationContainer {
        return new WorkScheduleDeviationContainer(DeviationType.Clinic, id, name, new WorkScheduleDeviation(startDate, endDate, new DaySchedule(records)), workScheduleId)
    }

    public static createEmployeeDeviation(
        id: number | undefined,
        name: string,
        startDate: Date,
        endDate: Date,
        records: ScheduleRecord[],
        workScheduleId?: number
    ) : WorkScheduleDeviationContainer {
        return new WorkScheduleDeviationContainer(DeviationType.Employee, id, name, new WorkScheduleDeviation(startDate, endDate, new DaySchedule(records)), workScheduleId)
    }


    public static fromServerBean(bean: WorkScheduleDeviationContainerServerBean) {
        return new WorkScheduleDeviationContainer(bean.type, bean.id, bean.name, WorkScheduleDeviation.fromServerBean(bean.deviationData), bean.workScheduleId)
    }

    public toAppointmentModel(): AppointmentModel {
        return {
            id: this.id,
            title: this.getName(),
            startDate: this.getDeviationData().getStartDate(),
            endDate: DateUtils.getNextDay(this.getDeviationData().getEndDate())
        }
    }
}

export type WorkScheduleDeviationContainerServerBean = {
    id: number,
    type: DeviationType,
    name: string,
    workScheduleId?: number,
    deviationData: WorkScheduleDeviationServerBean,
}

enum DeviationType {
    Clinic,
    Employee
}