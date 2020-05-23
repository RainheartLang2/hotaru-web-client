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

    public fromPureToMask(value: string): string {
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

    public fromMaskToPure(value: string): string {
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

    public getNextMaskedCharacterPosition(caretPosition: number): number {
        for (let index = caretPosition; index < this.mask.length; index++) {
            if (this.correlationMap.getBySecond(index) != null) {
                return index;
            }
        }
        return -1
    }

    public getPureIndexByMasked(maskedIndex: number): number {
        const pureIndex = this.correlationMap.getBySecond(maskedIndex)
        if (pureIndex == null) {
            throw new Error("no pure index for masked " + maskedIndex)
        }
        return pureIndex
    }
}