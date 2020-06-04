import EmployeeAppController from "../EmployeeAppController";
import {ScheduleRecord} from "../../../common/beans/ScheduleRecord";

export default class ClinicsWorkScheduleActions {

    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }


    public setDaySchedule(day: number, records: ScheduleRecord[]): void {
        this.controller.setState({
            clinicsWorkSchedulesList: this.controller.state.clinicsWorkSchedulesList.map(clinicWorkSchedule => {
                if (clinicWorkSchedule.clinicId != this.controller.state.clinicsWorkScheduleSelectedClinic!.id) {
                    return clinicWorkSchedule
                }

                return clinicWorkSchedule.setDaySchedule(day, records)
            })
        })
    }

    public setUsesDefault(usesDefault: boolean): void {
        console.log(usesDefault)
        this.controller.setState({
            clinicsWorkSchedulesList: this.controller.state.clinicsWorkSchedulesList.map(clinicWorkSchedule => {
                if (clinicWorkSchedule.clinicId != this.controller.state.clinicsWorkScheduleSelectedClinic!.id) {
                    return clinicWorkSchedule
                }

                return clinicWorkSchedule.setUsesDefault(usesDefault)
            })
        })
    }
}