import {ScheduleRecord} from "../../common/beans/ScheduleRecord";
import {Time} from "./Time";

const TimeRegExp = new RegExp("\\d\\d:\\d\\d")

export namespace DateUtils {
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
}