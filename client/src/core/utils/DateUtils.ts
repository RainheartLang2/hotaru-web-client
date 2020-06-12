import {ScheduleRecord} from "../../common/beans/ScheduleRecord";
import {Time} from "./Time";
import {StringUtils} from "./StringUtils";

const TimeRegExp = new RegExp("\\d\\d:\\d\\d")

export namespace DateUtils {
    import addLeadingZeros = StringUtils.addLeadingZeros;

    export function dateToTimeString(date: Date): string {
        return formatTime(date.getHours(), date.getMinutes())
    }

    export function formatTimeObject(time: Time): string {
        return formatTime(time.getHours(), time.getMinutes())
    }
    export function formatTime(hours: number, minutes: number): string {
        return (hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes)
    }

    export function isTimeValid(value: string): boolean {
        return TimeRegExp.test(value)
    }

    export function parseTime(value: string): Time | null {
        if (!isTimeValid(value)) {
            return null
        }
        return new Time(+value.substr(0, 2), +value.substr(3, 2))
    }

    export function mergeTimeRangesSequence(rangeSequence: ScheduleRecord[]): ScheduleRecord[] {
        const sortedSequence = rangeSequence.sort((first: ScheduleRecord, second: ScheduleRecord) => first.compareTo(second))
        const result: ScheduleRecord[] = []
        sortedSequence.forEach(record => {
            const poppedEl = result.pop()
            if (!poppedEl) {
                result.push(record)
                return
            }
            const mergeResult = poppedEl.merge(record)
            if (!mergeResult) {
                result.push(poppedEl)
                result.push(record)
            } else {
                result.push(mergeResult)
            }
        })
        return result
    }

    export function getNextDay(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    }

    export function getPreviousDate(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
    }

    export function formatDate(date: Date, format: string) {
        return format.replace("yyyy", addLeadingZeros(date.getFullYear(), 4))
            .replace("MM", addLeadingZeros(date.getMonth() + 1, 2))
            .replace("dd", addLeadingZeros(date.getDate(), 2))
    }

    export function standardFormatDate(date: Date) {
        return formatDate(date, "yyyy-MM-dd")
    }

    export function isDateValid(date: Date): boolean {
        return !!date && date.getTime() != NaN
    }
}