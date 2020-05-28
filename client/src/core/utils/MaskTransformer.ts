import {StringUtils} from "./StringUtils";
import Bijection from "./Bijection";

export default class MaskTransformer {
    private mask: string
    private correlationMap = new Bijection<number, number>()
    private emptyPlaceCharacter: string
    private innerMaskingChar: string

    constructor(mask: string = "", emptyCharacter: string = " ", innerMaskingChar = "*") {
        this.mask = mask
        this.emptyPlaceCharacter = emptyCharacter
        this.innerMaskingChar = innerMaskingChar
        if (this.mask) {
            let pureIndex = 0
            this.mask.split("").forEach((char, maskIndex) => {
                if (char == '?') {
                    this.correlationMap.set(pureIndex, maskIndex)
                    pureIndex++
                }
            })
        }
    }

    public maskValue(value: string): string {
        if (!this.mask) {
            return value
        }
        let result = StringUtils.clone(this.mask)
        value.split("").forEach((char, valueIndex) => {
            const characterIndexInMask = this.correlationMap.getByFirst(valueIndex)
            if (characterIndexInMask == null) {
                throw new Error("no pureToMask index for " + valueIndex)
            }
            if (char != this.innerMaskingChar) {
                result = StringUtils.setCharAt(result, characterIndexInMask, char)
            }
        })
        return StringUtils.replaceAll(result,'?', this.emptyPlaceCharacter)
    }

    public unmaskValue(value: string): string {
        if (!this.mask) {
            return value
        }
        let result = ""
        for (let i = 0; i < this.correlationMap.size; i++) {
            const characterIndexInMask = this.correlationMap.getByFirst(i)
            if (characterIndexInMask == null) {
                throw new Error("no pureToMask index for " + i)
            }
            result += value.charAt(characterIndexInMask)
        }
        return StringUtils.fillToLength(StringUtils.replaceAll(result,this.emptyPlaceCharacter, this.innerMaskingChar),
                                        this.correlationMap.size,
                                        this.innerMaskingChar)
    }

    /**
     * Получить ближайший от данного номер маскируемого символа
     * @param caretPosition - текущая позиция
     * @example - для маски (???)-???-??-??
     *  f(0) = 1
     *  f(1) = 1
     *  f(2) = 2
     *  f(3) = 3
     *  f(4) = 6
     *  f(5) = 6
     *  f(6) = 6
     *  ...
     *  Таким образом функция неубывающая и f(x) = x, если x - номер маскируемого символа в текущей маске
     */
    public getNextMaskedCharacterPosition(caretPosition: number): number {
        for (let index = caretPosition; index < this.mask.length; index++) {
            if (this.correlationMap.getBySecond(index) != null) {
                return index;
            }
        }
        return -1
    }

    /**
     * Получить количество всех символов в текущей маске, соответствующее указанному количеству маскированных символов
     * @param start - индекс начало последовательности для которой производится подсчёт
     * @param charactersNumber - количество маскируемых символов в потенциальной последовательности
     */
    public getMaskedDistance(start: number, charactersNumber: number): number {
        let index = start
        let charactersRemain = charactersNumber
        while (index < this.mask.length && charactersRemain > 0) {
            if (!this.isCharacterPartOfMask(index)) {
                charactersRemain--
            }
            index++
        }
        return index - start
    }

    /**
     * Получить индекс символа в размаскированном состоянии по его индексу в маскированном состоянии
      * @param maskedIndex
     */
    public getPureIndexByMasked(maskedIndex: number): number {
        const pureIndex = this.correlationMap.getBySecond(maskedIndex)
        if (pureIndex == null) {
            throw new Error("no pure index for masked " + maskedIndex)
        }
        return pureIndex
    }

    /**
     * Является ли символ немаскируемым
     * @param characterIndex
     */
    private isCharacterPartOfMask(characterIndex: number): boolean {
        return this.correlationMap.getBySecond(characterIndex) == null
    }
}