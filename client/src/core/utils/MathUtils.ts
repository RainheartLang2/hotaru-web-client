export namespace MathUtils {
    export function round(x: number, accuracy: number): number {
        if (accuracy < 0) {
            throw new Error("accuracy can not be less than zero")
        }

        return Math.round(x * Math.pow(10, accuracy)) / Math.pow(10, accuracy)
    }
}