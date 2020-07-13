export namespace CallbackUtils {
    export function callIf(condition: boolean, executeIfTrue: (callback: Function) => any, executeAnyway: Function): void {
        if (condition) {
            executeIfTrue(executeAnyway)
        } else {
            executeAnyway()
        }
    }
}