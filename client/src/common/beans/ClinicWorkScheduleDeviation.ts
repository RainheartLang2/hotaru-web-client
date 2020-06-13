import {WorkScheduleDeviation, WorkScheduleDeviationServerBean} from "./WorkScheduleDeviation";
import Identifiable from "../../core/entities/Identifiable";
import {ScheduleRecord} from "./ScheduleRecord";
import {DaySchedule} from "./DaySchedule";

export class ClinicWorkScheduleDeviation extends Identifiable {

    private name: string
    private workScheduleId?: number
    private deviationData: WorkScheduleDeviation

    constructor(id: number | undefined, name: string,deviationData: WorkScheduleDeviation, workScheduleId?: number) {
        super(id)
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

    public setDates(startDate: Date, endDate: Date): ClinicWorkScheduleDeviation {
        return new ClinicWorkScheduleDeviation(this.id, this.name,
            new WorkScheduleDeviation(startDate, endDate, this.deviationData.getChanges()), this.workScheduleId)
    }

    public static create(
        id: number | undefined,
        name: string,
        startDate: Date,
        endDate: Date,
        records: ScheduleRecord[],
        workScheduleId?: number
    ) : ClinicWorkScheduleDeviation {
        return new ClinicWorkScheduleDeviation(id, name, new WorkScheduleDeviation(startDate, endDate, new DaySchedule(records)), workScheduleId)
    }

    public static fromServerBean(bean: ClinicWorkScheduleDeviationServerBean) {
        return new ClinicWorkScheduleDeviation(bean.id, bean.name, WorkScheduleDeviation.fromServerBean(bean.deviationData), bean.workScheduleId)
    }
}

export type ClinicWorkScheduleDeviationServerBean = {
    id: number,
    name: string,
    workScheduleId?: number,
    deviationData: WorkScheduleDeviationServerBean,
}