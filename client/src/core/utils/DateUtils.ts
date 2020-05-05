export namespace DateUtils {
    export function dateToTimeString(date: Date): string {
        const hours = date.getHours()
        const minutes = date.getMinutes()
        return (hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes)
    }

    export type Time = {
        hours: number,
        minutes: number,
    }

    export function parseTime(value: string): Time {
        return {
            hours: +value.substr(0, 2),
            minutes: +value.substr(3, 2),
        }
    }
}