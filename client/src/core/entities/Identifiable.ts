export default abstract class Identifiable {
    id?: number

    constructor(id: number | undefined) {
        this.id = id
    }
}