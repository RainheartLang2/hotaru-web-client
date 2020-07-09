import Identifiable from "../entities/Identifiable";

export namespace CollectionUtils {
    export function mapArrayByUniquePredicate<ItemType, KeyType>(
        array: ItemType[],
        predicate: (item: ItemType) => KeyType | null
    ): Map<KeyType, ItemType> {
        const result = new Map<KeyType, ItemType>()
        array.forEach(item => {
            const predicateResult = predicate(item)
            if (predicateResult == null) {
                throw new Error("predicate returned null for item " + item)
            }
            if (result.get(predicateResult) != null) {
                throw new Error("predicate is not unique for item " + item)
            }
            result.set(predicateResult, item)
        })
        return result
    }

    export function mapIdentifiableArray<ItemType extends Identifiable>(array: ItemType[]): Map<number, ItemType> {
        return mapArrayByUniquePredicate(array, item => item.id ? item.id : 0)
    }

    export function mapArrayByPredicate<ItemType, KeyType>(
        array: ItemType[],
        predicate: (item: ItemType) => KeyType | null
    ): Map<KeyType, ItemType[]> {
        const result = new Map<KeyType, ItemType[]>()
        array.forEach(item => {
            const predicateResult = predicate(item)
            if (predicateResult == null) {
                throw new Error("predicate returned null for item " + item)
            }
            const array = result.get(predicateResult)
            if (!array) {
                result.set(predicateResult, [item])
            } else {
                array.push(item)
            }
        })
        return result
    }

    export function cloneMap<KeyType, ItemType>(map: Map<KeyType, ItemType>): Map<KeyType, ItemType> {
        const result = new Map<KeyType, ItemType>()
        map.forEach((item, key) => {
            result.set(key, item)
        })
        return result
    }

    export function cloneArray<ItemType>(array: ItemType[]): ItemType[] {
        return array.map(x => x)
    }

    export function mergeMaps<KeyType, ItemType>(targetMap: Map<KeyType, ItemType>, sourctMap: Map<KeyType, ItemType>): void {
        sourctMap.forEach((item, key) => {
            targetMap.set(key, item)
        })
    }

    export function updateArray<Type>(array: Type[], updatedItem: Type, predicate: (item: Type) => any) {
        return array.map(item => predicate(item) == predicate(updatedItem) ? updatedItem : item)
    }

    export function updateIdentifiableArray<Type extends Identifiable>(array: Type[], updatedItem: Type) {
        return updateArray(array, updatedItem, item => item.id)
    }

    export function fillArray<Type>(length: number, sample: Type): Type[] {
        const result = []
        for (let i = 0; i < length; i++) {
            result.push(sample)
        }
        return result
    }

    export function getSimpleNumberArray(length: number): number[] {
        return fillArray(length, 0).map((item, index) => index)
    }

    export function getDistinct<Type>(array: Type[]): Type[] {
        return array.filter((value, index, self) => self.indexOf(value) == index)
    }

    export function getMaxByPredicate<Type>(array: Type[], predicate: (item: Type) => number): number {
        let result: number | undefined = undefined
        array.forEach(item => {
            const predicateResult = predicate(item)
            if (!result || predicateResult > result) {
                result = predicateResult
            }
        })
        return result ? result : 0
    }
}