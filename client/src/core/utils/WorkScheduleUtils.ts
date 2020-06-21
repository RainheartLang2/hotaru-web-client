import EmployeeWorkSchedule from "../../common/beans/EmployeeWorkSchedule";
import {DaySchedule} from "../../common/beans/DaySchedule";

export namespace WorkScheduleUtils {
    export function getDayScheduleForDate(
        schedules: EmployeeWorkSchedule[],
        defaultSchedules: EmployeeWorkSchedule[],
        date: Date
    ): DaySchedule {
        let actualSchedule = getScheduleForDate(schedules, date)
        if (!actualSchedule || actualSchedule.isUsesDefault()) {
            actualSchedule = getScheduleForDate(defaultSchedules, date)
        }

        if (!actualSchedule) {
            return new DaySchedule([])
        }

        return actualSchedule.getDayScheduleForDate(date)
    }

    export function getScheduleForDate(schedules: EmployeeWorkSchedule[], date: Date): EmployeeWorkSchedule | null {
        let result = null
        schedules.forEach(schedule => {
            if (schedule.getStartDate() && schedule.getStartDate()! < date
                && (!schedule.getEndDate() || schedule.getEndDate()! > date)) {
                result = schedule
                return
            }
        })
        return result
    }
}