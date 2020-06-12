import {WorkScheduleDeviation} from "./WorkScheduleDeviation";
import Identifiable from "../../core/entities/Identifiable";

export class ClinicWorkScheduleDeviation extends Identifiable {

    private name: string
    private clinicId?: number
    private global: boolean
    private deviationData: WorkScheduleDeviation

    constructor(id: number | undefined, name: string, global: boolean, deviationData: WorkScheduleDeviation, clinicId?: number) {
        super(id)
        this.name = name;
        this.clinicId = clinicId;
        this.global = global;
        this.deviationData = deviationData;
    }

    public getClinicId(): number | undefined {
        return this.clinicId
    }

    public isGlobal(): boolean {
        return this.global
    }

    public getDeviationData(): WorkScheduleDeviation {
        return this.deviationData
    }

    public getName(): string {
        return this.name
    }

    public setDates(startDate: Date, endDate: Date): ClinicWorkScheduleDeviation {
        return new ClinicWorkScheduleDeviation(this.id, this.name, this.global,
            new WorkScheduleDeviation(startDate, endDate, this.deviationData.getChanges()))
    }
}