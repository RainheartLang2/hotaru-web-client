import EmployeeAppController from "../EmployeeAppController";
import {ScheduleRecord} from "../../../common/beans/ScheduleRecord";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import EmployeeWorkSchedule, {EmployeeWorkScheduleServerBean} from "../../../common/beans/EmployeeWorkSchedule";
import {ChangeSet} from "@devexpress/dx-react-scheduler";
import {DateUtils} from "../../../core/utils/DateUtils";
import {
    WorkScheduleDeviationContainer,
    WorkScheduleDeviationContainerServerBean
} from "../../../common/beans/WorkScheduleDeviationContainer";

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
                const deviations = result.deviations as WorkScheduleDeviationContainerServerBean[]
                this.controller.setState({
                    employeeWorkSchedulesList: workSchedulesList.map(schedule => EmployeeWorkSchedule.fromServerBean(schedule)),
                    employeeWorkScheduleDeviationsList: deviations.map(deviation => WorkScheduleDeviationContainer.fromServerBean(deviation))
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

    private updateDeviationDates(id: number, startDate: Date, endDate: Date, callback: Function) :void {
        fetchUserZoneRpc({
            method: RemoteMethods.updateEmployeeScheduleDeviationDates,
            params: [id, startDate, endDate],
            successCallback: (result) => {
                this.controller.setState({
                    employeeWorkScheduleDeviationsList: this.controller.state.employeeWorkScheduleDeviationsList.map(deviation => {
                        if (deviation.id != id) {
                            return deviation
                        }
                        return deviation.setDates(startDate, endDate)
                    })
                })
                callback()
            }
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

    public addDeviation(
        name: string,
        global: boolean,
        startDate: Date,
        endDate: Date,
        records: ScheduleRecord[],
        callback: Function = () => {}
    ): void {

        const workScheduleId = global ? undefined : this.controller.state.scheduleForSelectedEmployee!.id
        const newDeviation = WorkScheduleDeviationContainer.createEmployeeDeviation(this.controller.state.employeeScheduleDeviationsAppointments.length + 1
            , name, startDate, endDate, records, workScheduleId)
        fetchUserZoneRpc({
            method: RemoteMethods.createEmployeeScheduleDeviation,
            params: [name, workScheduleId, startDate, endDate, records],
            successCallback: (result) => {
                this.controller.setState({
                    employeeWorkScheduleDeviationsList: [...this.controller.state.employeeWorkScheduleDeviationsList, newDeviation]
                })
                callback()
            }
        })
    }

    public updateDeviation(
        id: number,
        name: string,
        global: boolean,
        startDate: Date,
        endDate: Date,
        records: ScheduleRecord[],
        callback: Function = () => {}
    ): void {
        const workScheduleId = global ? undefined : this.controller.state.scheduleForSelectedEmployee!.id
        const newDeviation = WorkScheduleDeviationContainer.createEmployeeDeviation(id, name, startDate, endDate, records, workScheduleId)
        fetchUserZoneRpc({
            method: RemoteMethods.updateEmployeeScheduleDeviation,
            params: [id, name, workScheduleId, startDate, endDate, records],
            successCallback: (result) => {
                this.controller.setState({
                    employeeWorkScheduleDeviationsList: this.controller.state.employeeWorkScheduleDeviationsList.map(deviation => {
                        if (deviation.id != id) {
                            return deviation
                        }
                        return newDeviation
                    })
                })
                callback()
            }
        })
    }

    public deleteDeviation(id: number, callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteEmployeeScheduleDeviation,
            params: [id],
            successCallback: () => {
                this.controller.setState({
                    employeeWorkScheduleDeviationsList: this.controller.state.employeeWorkScheduleDeviationsList.filter(deviation => deviation.id != id)
                })
                callback()
            }
        })
    }

    public loadEmployeeSchedule(employeeId: number, date: Date, callback: Function = () => {}): void {
        const startDate = DateUtils.getMondayByDate(date)
        const endDate = DateUtils.getSundayByDate(date)
        fetchUserZoneRpc({
            method: RemoteMethods.getDateRangeSchedule,
            params: [employeeId, startDate, endDate],
            successCallback: result => {
                const schedules = result.workSchedules as EmployeeWorkScheduleServerBean[]
                const deviations = result.deviations as WorkScheduleDeviationContainerServerBean[]
                this.controller.setState({
                    employeeWorkSchedulesList: schedules.map(schedule => EmployeeWorkSchedule.fromServerBean(schedule)),
                    employeeWorkScheduleDeviationsList: deviations.map(deviation => WorkScheduleDeviationContainer.fromServerBean(deviation)),
                })
                callback()
            }
        })
    }
}