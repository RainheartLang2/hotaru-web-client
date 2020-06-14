import Identifiable from "../../core/entities/Identifiable";
import WorkSchedule from "./WorkSchedule";

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
}