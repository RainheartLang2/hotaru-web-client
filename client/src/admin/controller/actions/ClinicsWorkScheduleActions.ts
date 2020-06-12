import EmployeeAppController from "../EmployeeAppController";
import {ScheduleRecord} from "../../../common/beans/ScheduleRecord";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {plainToClass} from "class-transformer";
import {ClinicWorkSchedule, ClinicWorkScheduleServerBean} from "../../../common/beans/ClinicWorkSchedule";
import {ChangeSet} from "@devexpress/dx-react-scheduler";
import {ClinicWorkScheduleDeviation} from "../../../common/beans/ClinicWorkScheduleDeviation";
import {DaySchedule} from "../../../common/beans/DaySchedule";
import {DateUtils} from "../../../core/utils/DateUtils";

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
        const clinicsWorkSchedulesList = this.controller.state.clinicsWorkSchedulesList.map(clinicWorkSchedule => {
            if (clinicWorkSchedule.clinicId != selectedClinicId) {
                return clinicWorkSchedule
            }
            const newDaySchedule = clinicWorkSchedule.setDaySchedule(day, records)
            console.log(newDaySchedule)
            return newDaySchedule
        })
        console.log(clinicsWorkSchedulesList)
        this.controller.setState({clinicsWorkSchedulesList})
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

    private updateDeviationDates(id: number, startDate: Date, endDate: Date, callback: Function) :void {
        this.controller.setState({
            clinicsWorkScheduleDeviationsList: this.controller.state.clinicsWorkScheduleDeviationsList.map(deviation => {
                if (deviation.id != id) {
                    return deviation
                }
                return deviation.setDates(startDate, endDate)
            })
        })
    }

    public handleDeviationAppointmentChange(changes: ChangeSet, callback: Function = () => {}): void {
        if (!changes.changed) {
            return
        }
        const changedList = changes.changed
        for (let key in changedList) {
            const id = +key
            const dateRange = changedList[key]
            this.updateDeviationDates(id, dateRange.startDate, DateUtils.getPreviousDate(dateRange.endDate), callback)
        }
    }

    public addDeviation(name: string, global: boolean, startDate: Date, endDate: Date, records: ScheduleRecord[]): void {
        const clinicId = global ? undefined : this.controller.state.clinicsWorkScheduleSelectedClinic!.id
        const newDeviation = ClinicWorkScheduleDeviation.create(this.controller.state.clinicsWorkScheduleDeviationsList.length + 5, name, global, startDate, endDate, records, clinicId)
        this.controller.setState({
            clinicsWorkScheduleDeviationsList: [...this.controller.state.clinicsWorkScheduleDeviationsList, newDeviation]
        })
    }

    public updateDeviation(id: number, name: string, global: boolean, startDate: Date, endDate: Date, records: ScheduleRecord[]): void {
        const clinicId = global ? undefined : this.controller.state.clinicsWorkScheduleSelectedClinic!.id
        const newDeviation = ClinicWorkScheduleDeviation.create(id, name, global, startDate, endDate, records, clinicId)
        this.controller.setState({
            clinicsWorkScheduleDeviationsList: this.controller.state.clinicsWorkScheduleDeviationsList.map(deviation => {
                if (deviation.id != id) {
                    return deviation
                }
                return newDeviation
            })
        })
    }

    public deleteDeviation(id: number): void {
        this.controller.setState({
            clinicsWorkScheduleDeviationsList: this.controller.state.clinicsWorkScheduleDeviationsList.filter(deviation => deviation.id != id)
        })
    }
}