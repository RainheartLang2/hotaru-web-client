import Field from "./Field";

export default abstract class FieldForm {
    private fields: Map<string, Field<any>> = new Map()
    private errorMessages: string[] = []

    public addField(fieldName: string, field: Field<any>): FieldForm {
        if (this.fields.get(fieldName)) {
            throw new Error("field with name " + fieldName + " already exists")
        }
        this.fields.set(fieldName, field)
        return this
    }

    get hasErrors(): boolean {
        return this.errorMessages.length > 0
    }

    get errors(): string[] {
        const result: string[] = []
        this.fields.forEach((field) => {
            field.errors.forEach((error) => {
                result.push(error)
            })
        })
        return result
    }

    public getFieldValue(fieldName: string): string {
        const field = this.fields.get(fieldName)
        if (!field) {
            throw new Error("field with name " + fieldName + " does not exist")
        }
        return field.getValue()
    }

    protected setValue(fieldName: string, value: string) {
        const field = this.fields.get(fieldName)
        if (!field) {
            throw new Error("field with name " + fieldName + " does not exist")
        }

        field.setValue(value)
    }
}