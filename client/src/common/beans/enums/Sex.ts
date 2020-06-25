import MessageResource from "../../../core/message/MessageResource";

export enum Sex {
    Male,
    Female,
}

export namespace Sex {
    export function getStringForSelect(sex: Sex | null): string {
        switch (sex) {
            case null: return MessageResource.getMessage("common.sex.select.none")
            case Sex.Male: return MessageResource.getMessage("common.sex.select.male")
            case Sex.Female: return MessageResource.getMessage("common.sex.select.female")
        }
    }

    export function createMapForSelect() {
        const sexesMap = new Map<number, Sex | null>()
        sexesMap.set(getKeyForSelect(null), null)
        sexesMap.set(getKeyForSelect(Sex.Male), Sex.Male)
        sexesMap.set(getKeyForSelect(Sex.Female), Sex.Female)
        return sexesMap
    }

    export function getKeyForSelect(sex: Sex | null): number {
        switch (sex) {
            case null: return 0
            case Sex.Male: return 1
            case Sex.Female: return 2
        }
    }
}