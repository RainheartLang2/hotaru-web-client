import EmployeeWorkSchedule from "../../common/beans/EmployeeWorkSchedule";
import {DaySchedule} from "../../common/beans/DaySchedule";
import {WorkScheduleDeviationContainer} from "../../common/beans/WorkScheduleDeviationContainer";
import {DateUtils} from "./DateUtils";

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

    export function getDayScheduleForDateFromDeviations(
        deviations: WorkScheduleDeviationContainer[],
        date: Date,
    ): DaySchedule | null {
        let result = null
        deviations.forEach(deviation => {
            if (deviation.getStartDate() && DateUtils.dateIsBetween(date, deviation.getStartDate(), deviation.getEndDate())) {
                result = deviation.getChanges()
                return
            }
        })
        return result
    }

    export function getScheduleForDate(schedules: EmployeeWorkSchedule[], date: Date): EmployeeWorkSchedule | null {
        let result = null
        schedules.forEach(schedule => {
            if (schedule.getStartDate() && DateUtils.dateIsBetween(date, schedule.getStartDate(), schedule.getEndDate())) {
                result = schedule
                return
            }
        })
        return result
    }
}