export default class Bijection<FirstType, SecondType> {
    private firstToSecond: Map<FirstType, SecondType> = new Map()
    private secondToFirst: Map<SecondType, FirstType> = new Map()

    public set(first: FirstType, second: SecondType): void {
        this.firstToSecond.set(first, second)
        this.secondToFirst.set(second, first)
    }

    public getByFirst(first: FirstType): SecondType | undefined {
        return this.firstToSecond.get(first)
    }

    public getBySecond(second: SecondType): FirstType | undefined {
        return this.secondToFirst.get(second)
    }

    public get size(): number {
        return this.firstToSecond.size
    }
}