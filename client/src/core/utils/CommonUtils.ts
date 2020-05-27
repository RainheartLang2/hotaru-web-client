import {Field} from "../mvc/store/Field";

export namespace CommonUtils {
    export function valueIfDiffers<ValueType>(value: ValueType, source: ValueType): ValueType | null {
        return value === source ? null : value
    }

    export function merge<ValueType>(value: ValueType, source: ValueType): ValueType | null {
        return value ? value : source
    }

    export function mergeTypes<FirstType, SecondType>(first: FirstType, second: SecondType): FirstType & SecondType {
        const result: {[k in string]: any} = {}
        for (let key in first) {
            result[key] = first[key]
        }

        for (let key in second) {
            result[key] = second[key]
        }

        return result as FirstType & SecondType
    }

    export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
        const result: any = {};
        keys.forEach(key => {
            result[key] = obj[key];
        })
        return result;
    }

    export function createLooseObject<Type>(properties: [any, any][]): Partial<Type> {
        const result: any = {}
        properties.forEach(propertyEntry => result[propertyEntry[0]] = propertyEntry[1])
        return result
    }

    export function allFieldsAreEmpty(fields: Field[]): boolean {
        let result = true
        fields.forEach(field => {
            if (field.value.length > 0) {
                result = false
                return
            }
        })
        return result
    }
}