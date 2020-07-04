import {Field} from "../mvc/store/Field";

export namespace StringUtils {

    /**
     * Заменить символ с определённым номером в данной строке на новый
      * @param str - исходная строка, в которой будет производится замена
     * @param index - индекс заменяемого символа
     * @param chr - новый символ
     * @return новая строка
     * @example setCharAt("Hello!", 1, "a") = "Hallo!"
     */
    export const setCharAt = (str: string, index: number, chr: string): string => {
        if (index > str.length - 1) return str
        return str.substr(0, index) + chr + str.substr(index + 1)
    }

    export const insertCharAt = (str: string, index: number, chr: string): string => {
        return str.substr(0, index) + chr + str.substr(index)
    }

    /**
     * Удалить символ с указанным индексом
     * @param str - исходная строка
     * @param index - индекс удаляемого символа
     * @return - новая строка
     * @example - deleteCharAt("Hello!", 1) = "Hllo!"
     */
    export const deleteCharAt = (str: string, index: number): string => setCharAt(str, index, "")

    /**
     * Удалить последовательность символов из строки
     * @param str - исходная строка
     * @param from - индекс первого удаляемого символа
     * @param size - длина удаляемой последовательности
     * @return - новая строка
     * @example - deleteChars("Hello!", 2, 3) = "He!"
     */
    export const deleteChars = (str: string, from: number, size: number): string => {
        if (from + size > str.length) {
            throw new Error("")
        }
        return str.substr(0, from) + str.substr(from + size, str.length)
    }

    /**
     * Клонировать строку (создать новую, идентичную по входящим в неё символам)
     * @param str - исходная строка
     * @return - новая строка
     */
    export const clone = (str: string): string => {
        return (" " + str).slice(1)
    }

    /**
     * Заменить все искомые подстроки в строке на новые
     * @param value - исходная строка
     * @param searchSequence - подстрока, образцы которой будут заменены в исходной строке
     * @param replaceSequence - подстрока, на которую будут заменены вхождения searchSequence в исходной строке
     */
    export const replaceAll = (value: string, searchSequence: string, replaceSequence: string): string => {
        return value.split(searchSequence).join(replaceSequence)
    }

    /**
     * Заполнить строку указанными символами до указанной длины
     * @param value - исходная строка
     * @param requiredLength - длина результирующей строки
     * @param fillCharacter - символ, которым производится заполнение
     * @return - новая строка
     * @example - fillToLength("Hello!", 10, "?") = "Hello!????"
     */
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

    /**
     * Проверить указанные строки на пустоту
     * @param strings
     * @return - true, если каждая из данных строк пуста, иначе - false
     */
    export const areStringsEmpty = (strings: string[]): boolean => {
        let result = true
        strings.forEach(value => {
            if (value.length > 0) {
                result = false
                return
            }
        })
        return result
    }

    /**
     * Перевернуть строку
     * @param str - исходная строка
     * @return новая строка
     * @example - reverse("Hello!") = "!olleH"
     */
    const reverse = (str: string): string => {
        return str.split("").reverse().join("");
    }

    /**
     * Вычислить длину максимального совпадающего префикса для двух данных строк
     * @param firstString
     * @param secondString
     * @example getPrefixNumber("abcef", "abcfd") = 3
     * @example f("a", "b") = 0
     * @example f("abc", "abcde") = 3
     */
    const getPrefixNumber  = (firstString: string, secondString: string): number => {
        for (let i = 0; i < firstString.length; i++) {
            if (secondString.length <= i || firstString.charAt(i) != secondString.charAt(i)) {
                return i;
            }
        }
        return firstString.length
    }

    /**
     * Аналогично getPrefixNumber - Вычислить длину максимального совпадающего постфикса(суффикса) для двух данных строк
     * @param firstString
     * @param secondString
     */
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

    /**
     * Получить данные о различии двух данных строк.
     * @return - {
     *     type: - можно ли получить вторую строку из первой добавлением новых символов (Addition), удалением (Deletion), заменой (Change).
     *              Если строки не равны, то возвращаем NONE.
     * }
     * @param firstString
     * @param secondString
     */
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

    export function addLeadingZeros(num: number, resultLength: number): string {
        let result = num.toString()
        for (let i = 0; i < resultLength - num.toString().length; i++) {
            result = "0" + result
        }
        return result
    }

    export function numberToStringEmptyIfZero(num: number) : string {
        if (num == 0) {
            return ""
        }
        return num.toString()
    }

    export function stringToNumberZeroIfEmpty(value: string): number {
        return value == "" ? 0 : +value
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