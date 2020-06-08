import EmployeeAppController from "../EmployeeAppController";
import {ScheduleRecord} from "../../../common/beans/ScheduleRecord";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {plainToClass} from "class-transformer";
import {ClinicWorkSchedule, ClinicWorkScheduleServerBean} from "../../../common/beans/ClinicWorkSchedule";

export default class ClinicsWorkScheduleActions {

    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadWorkSchedule(callback: Function) {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllClinicWorkSchedules,
            successCallback: (result) => {
                const resultList = result as ClinicWorkScheduleServerBean[]
                this.controller.setState({
                    clinicsWorkSchedulesList: resultList.map(schedule => ClinicWorkSchedule.fromServerBean(schedule)),
                })
                callback()
            }
        })
    }

    private applyDayScheduleChanges(selectedClinicId: number, day: number, records: ScheduleRecord[]): void {
        this.controller.setState({
            clinicsWorkSchedulesList: this.controller.state.clinicsWorkSchedulesList.map(clinicWorkSchedule => {
                if (clinicWorkSchedule.clinicId != selectedClinicId) {
                    return clinicWorkSchedule
                }
                return clinicWorkSchedule.setDaySchedule(day, records)
            })
        })
    }

    public setDaySchedule(day: number, records: ScheduleRecord[]): void {
        const selectedClinicId = this.controller.state.clinicsWorkScheduleSelectedClinic!.id!
        fetchUserZoneRpc({
            method: RemoteMethods.editClinicWorkSchedule,
            params: [selectedClinicId, day, records],
            successCallback: (result) => {
                this.applyDayScheduleChanges(selectedClinicId, day, records)
            }
        })
    }

    public setUsesDefault(usesDefault: boolean): void {
        const selectedClinicId = this.controller.state.clinicsWorkScheduleSelectedClinic!.id!
        fetchUserZoneRpc({
            method: RemoteMethods.setUsesDefaultSchedule,
            params: [selectedClinicId, usesDefault],
            successCallback: (result) => {
                this.controller.setState({
                    clinicsWorkSchedulesList: this.controller.state.clinicsWorkSchedulesList.map(clinicWorkSchedule => {
                        if (clinicWorkSchedule.clinicId != this.controller.state.clinicsWorkScheduleSelectedClinic!.id) {
                            return clinicWorkSchedule
                        }
                        return clinicWorkSchedule.setUsesDefault(usesDefault)
                    })
                })
            }
        })
    }
}