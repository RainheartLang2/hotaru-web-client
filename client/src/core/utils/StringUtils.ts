export namespace StringUtils {
    export const setCharAt = (str: string, index: number, chr: string): string => {
        if (index > str.length - 1) return str
        return str.substr(0, index) + chr + str.substr(index + 1)
    }

    export const clone = (str: string): string => {
        return (" " + str).slice(1)
    }

    export const replaceAll = (value: string, searchSequence: string, replaceSequence: string) : string => {
        return value.split(searchSequence).join(replaceSequence)
    }
}