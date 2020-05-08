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

    export function mergeMaps<KeyType, ItemType>(targetMap: Map<KeyType, ItemType>, sourctMap: Map<KeyType, ItemType>): void {
        sourctMap.forEach((item, key) => {
            targetMap.set(key, item)
        })
    }
}