export class Time {
    private _hours: number
    private _minutes: number

    constructor(hours: number, minutes: number) {
        if (hours > 23) {
            throw new Error("hours amount can not be greater than 23, though it is " + hours)
        }
        if (minutes > 59) {
            throw new Error("minutes amount can not be greater than 58, though it is " + minutes)
        }
        this._hours = hours;
        this._minutes = minutes;
    }

    get hours(): number {
        return this._hours;
    }

    get minutes(): number {
        return this._minutes;
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
}