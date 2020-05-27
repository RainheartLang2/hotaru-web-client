import {Field} from "../mvc/store/Field";

export namespace StringUtils {
    export const setCharAt = (str: string, index: number, chr: string): string => {
        if (index > str.length - 1) return str
        return str.substr(0, index) + chr + str.substr(index + 1)
    }

    export const deleteCharAt = (str: string, index: number): string => setCharAt(str, index, "")

    export const clone = (str: string): string => {
        return (" " + str).slice(1)
    }

    export const replaceAll = (value: string, searchSequence: string, replaceSequence: string): string => {
        return value.split(searchSequence).join(replaceSequence)
    }

    export const fillToLength = (value: string, requiredLength: number, fillCharacter: string): string => {
        if (fillCharacter.length != 1) {
            throw new Error("fillCharacter variable should be string with length of 1")
        }
        let result = value
        for (let index = value.length; index < requiredLength; index++) {
            result += fillCharacter
        }
        return result
    }

    export const allStringsAreEmpty = (strings: string[]): boolean => {
        let result = true
        strings.forEach(value => {
            if (value.length > 0) {
                result = false
                return
            }
        })
        return result
    }
}