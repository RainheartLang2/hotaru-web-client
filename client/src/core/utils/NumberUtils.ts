export namespace NumberUtils {
    export function min(first: number, second: number): number {
        return first > second ? second : first
    }

    export function max(first: number, second: number): number {
        return first > second ? first : second
    }
}