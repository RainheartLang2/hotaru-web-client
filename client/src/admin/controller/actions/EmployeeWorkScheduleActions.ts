import EmployeeAppController from "../EmployeeAppController";
import {ScheduleRecord} from "../../../common/beans/ScheduleRecord";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {ClinicWorkSchedule, ClinicWorkScheduleServerBean} from "../../../common/beans/ClinicWorkSchedule";
import {
    ClinicWorkScheduleDeviation,
    ClinicWorkScheduleDeviationServerBean
} from "../../../common/beans/ClinicWorkScheduleDeviation";
import EmployeeWorkSchedule, {EmployeeWorkScheduleServerBean} from "../../../common/beans/EmployeeWorkSchedule";

export default class EmployeeWorkScheduleActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadWorkSchedule(callback: Function) {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllEmployeeWorkSchedules,
            successCallback: (result: any) => {
                const workSchedulesList = result.workSchedules as EmployeeWorkScheduleServerBean[]
                this.controller.setState({
                    employeeWorkSchedulesList: workSchedulesList.map(schedule => EmployeeWorkSchedule.fromServerBean(schedule)),
                })
                callback()
            }
        })
    }

    public setUsesDefault(value: boolean) {
        const selectedEmployeeId = this.controller.state.employeeScheduleSelectedEmployee!.id
        fetchUserZoneRpc({
            method: RemoteMethods.setUsesDefaultEmployeeSchedule,
            params: [selectedEmployeeId, value],
            successCallback: (result) => this.controller.setState({
                employeeWorkSchedulesList: this.controller.state.employeeWorkSchedulesList.map(schedule => {
                    if (schedule.getEmployeeId() != selectedEmployeeId) {
                        return schedule
                    }
                    return schedule.setUsesDefault(value)
                })
            })
        })
    }

    private applyDayScheduleChanges(selectedEmployeeId: number, day: number, records: ScheduleRecord[]): void {
        const employeesWorkSchedulesList = this.controller.state.employeeWorkSchedulesList.map(schedule => {
            if (schedule.getEmployeeId() != selectedEmployeeId) {
                return schedule
            }
            const newDaySchedule = schedule.setDaySchedule(day, records)
            return newDaySchedule
        })
        this.controller.setState({employeeWorkSchedulesList: employeesWorkSchedulesList})
    }

    public setDaySchedule(day: number, records: ScheduleRecord[]): void {
        const selectedEmployeeId = this.controller.state.employeeScheduleSelectedEmployee!.id
        fetchUserZoneRpc({
            method: RemoteMethods.editEmployeeWorkSchedule,
            params: [selectedEmployeeId, day, records],
            successCallback: () => this.applyDayScheduleChanges(selectedEmployeeId, day, records)
        })
    }

    public setScheduleLength(length: number): void {
        const selectedEmployeeId = this.controller.state.employeeScheduleSelectedEmployee!.id
        fetchUserZoneRpc({
            method: RemoteMethods.setEmployeeScheduleLength,
            params: [selectedEmployeeId, length],
            successCallback: () => {
                this.controller.setState({
                    employeeWorkSchedulesList: this.controller.state.employeeWorkSchedulesList.map(schedule => {
                        if (schedule.getEmployeeId() != selectedEmployeeId) {
                            return schedule
                        }
                        const newDaySchedule = schedule.setLength(length)
                        return newDaySchedule
                    })
                })
            }
        })
    }

    public setWeekly(): void {
        const selectedEmployeeId = this.controller.state.employeeScheduleSelectedEmployee!.id
        fetchUserZoneRpc({
            method: RemoteMethods.setEmployeeScheduleWeekly,
            params: [selectedEmployeeId],
            successCallback: () => {
                this.controller.setState({
                    employeeWorkSchedulesList: this.controller.state.employeeWorkSchedulesList.map(schedule => {
                        if (schedule.getEmployeeId() != selectedEmployeeId) {
                            return schedule
                        }
                        const newDaySchedule = schedule.setWeekly()
                        return newDaySchedule
                    })
                })
            }
        })
    }
}