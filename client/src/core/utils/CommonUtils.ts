export namespace CommonUtils {
    export function valueIfDiffers<ValueType>(value: ValueType, source: ValueType): ValueType | null {
        return value === source ? null : value
    }

    export function merge<ValueType>(value: ValueType, source: ValueType): ValueType | null {
        return value ? value : source
    }
}