import {StringUtils} from "./StringUtils";
import RevertableMap from "./RevertableMap";

export default class MaskTransformer {
    private mask: string
    private correlationMap = new RevertableMap<number, number>()

    constructor(mask?: string) {
        this.mask = mask ? mask : "";
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
            result = StringUtils.setCharAt(result, characterIndexInMask, char)
        })
        return StringUtils.replaceAll(result,'?', ' ')
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
        return StringUtils.replaceAll(result," ", "")
    }
}