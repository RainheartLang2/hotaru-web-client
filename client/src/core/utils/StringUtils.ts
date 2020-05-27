import {Field} from "../mvc/store/Field";

export namespace StringUtils {
    export const setCharAt = (str: string, index: number, chr: string): string => {
        if (index > str.length - 1) return str
        return str.substr(0, index) + chr + str.substr(index + 1)
    }

    export const deleteCharAt = (str: string, index: number): string => setCharAt(str, index, "")

    export const deleteChars = (str: string, from: number, size: number): string => {
        if (from + size > str.length) {
            throw new Error("")
        }
        return str.substr(0, from) + str.substr(from + size, str.length)
    }

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


    const reverse = (str: string): string => {
        return str.split("").reverse().join("");
    }

    const getPrefixNumber  = (firstString: string, secondString: string): number => {
        for (let i = 0; i < firstString.length; i++) {
            if (secondString.length <= i || firstString.charAt(i) != secondString.charAt(i)) {
                return i;
            }
        }
        return firstString.length
    }

    const getPostfixNumber = (firstString: string, secondString: string): number => {
        return getPrefixNumber(reverse(firstString), reverse(secondString))
    }

    const getIntersectionNumber = (str: string, prefixNumber: number, postfix: number) => {
        let prefixIndex = prefixNumber
        let postfixIndex = str.length - postfix
        while (prefixIndex < str.length && postfixIndex >=0 && str.charAt(prefixNumber) == str.charAt(postfixIndex)) {
            prefixIndex--
            postfixIndex++
        }
        return prefixNumber - prefixIndex
    }

    export const getDifference = (firstString: string, secondString: string): Difference => {
        if (firstString == secondString) {
            return {
                type: DifferenceType.None,
                position: 0,
                size: 0,
            }
        }
        let majorString
        let minorString
        let type
        if (secondString.length > firstString.length) {
            majorString = secondString
            minorString = firstString
            type = DifferenceType.Addition
        } else {
            majorString = firstString
            minorString = secondString
            type = DifferenceType.Deletion
        }

        const lengthDifference = majorString.length - minorString.length
        const prefixNumber = getPrefixNumber(minorString, majorString)
        const postfixNumber = getPostfixNumber(minorString, majorString)
        if (prefixNumber + postfixNumber + lengthDifference >= majorString.length) {
            return {
                type,
                position: prefixNumber,
                size: lengthDifference
            }
        } else {
            return {
                type: DifferenceType.Unknown,
                position: 0,
                size: 0,
            }
        }
    }


    export enum DifferenceType {
        Addition,
        Deletion,
        None,
        Unknown,
    }

    export type Difference = {
        type: DifferenceType,
        position: number,
        size: number,
    }
}