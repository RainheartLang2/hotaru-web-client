import Identitiable from "../../core/entities/Identitiable";

export default class Species implements Identitiable {
    id?: number
    name?: string

    getId(): number {
        return this.id ? this.id : 0;
    }

    setId(id: number): void {
        this.id = id
    }
}