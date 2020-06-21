export class Time {
    private hours: number
    private minutes: number

    constructor(hours: number, minutes: number) {
        if (hours > 23) {
            throw new Error("hours amount can not be greater than 23, though it is " + hours)
        }
        if (minutes > 59) {
            throw new Error("minutes amount can not be greater than 58, though it is " + minutes)
        }
        this.hours = hours;
        this.minutes = minutes;
    }

    public getHours(): number {
        return this.hours
    }

    public getMinutes(): number {
        return this.minutes
    }

    public greaterThan(second: Time): boolean {
        return this.compareTo(second) > 0
    }

    public lessThan(second: Time): boolean {
        return this.compareTo(second) < 0
    }

    public equals(second: Time): boolean {
        return this.compareTo(second) == 0
    }

    public compareTo(second: Time): number {
        if (this.hours != second.hours) {
            return this.hours - second.hours
        }

        return this.minutes - second.minutes
    }

    public mergeWithDate(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.hours, this.minutes)
    }

    public static min(first: Time, second: Time): Time {
        const comparisonResult = first.compareTo(second)
        if (comparisonResult >= 0) {
            return second
        } else {
            return first
        }
    }

    public static max(first: Time, second: Time) {
        const comparisonResult = first.compareTo(second)
        if (comparisonResult >= 0) {
            return first
        } else {
            return second
        }
    }


    public static fromServerBean(bean: TimeServerBean): Time {
        return new Time(bean.hours, bean.minutes)
    }
}

export type TimeServerBean = {
    hours: number
    minutes: number

}