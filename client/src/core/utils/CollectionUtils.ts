export namespace CollectionUtils {
    export function mapArrayByPredicate<ItemType, KeyType>(
        array: ItemType[],
        predicate: (item: ItemType) => KeyType | null
    ): Map<KeyType, ItemType> {
        const result = new Map<KeyType, ItemType>()
        array.forEach(item => {
            const predicateResult = predicate(item)
            if (!predicateResult) {
                throw new Error("predicate returned null for item " + item)
            }
            result.set(predicateResult, item)
        })
        return result
    }
}