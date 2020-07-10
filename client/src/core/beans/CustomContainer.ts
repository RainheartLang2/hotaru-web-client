export default class CustomContainer<Type> {
    public list: Type[]

    constructor(list: Type[]) {
        this.list = list;
    }
}