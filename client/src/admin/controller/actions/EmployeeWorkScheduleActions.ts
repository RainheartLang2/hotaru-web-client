import EmployeeAppController from "../EmployeeAppController";
import {ScheduleRecord} from "../../../common/beans/ScheduleRecord";

export default class EmployeeWorkScheduleActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public setUsesDefault(value: boolean) {
        this.controller.setState({
            employeeWorkSchedulesList: this.controller.state.employeeWorkSchedulesList.map(schedule => {
                if (schedule.getEmployeeId() != this.controller.state.employeeScheduleSelectedEmployee!.id) {
                    return schedule
                }
                return schedule.setUsesDefault(value)
            })
        })
    }

    private applyDayScheduleChanges(selectedEmployeeId: number, day: number, records: ScheduleRecord[]): void {
        const employeesWorkSchedulesList = this.controller.state.employeeWorkSchedulesList.map(schedule => {
            console.log(schedule.getEmployeeId())
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
        this.applyDayScheduleChanges(selectedEmployeeId, day, records)
    }

}