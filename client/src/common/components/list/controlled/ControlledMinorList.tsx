import MinorList, {MinorListProperties} from "../MinorList";

export default class ControlledMinorList<ItemType> extends MinorList<ItemType, Properties<ItemType>> {
    constructor(props: Properties<ItemType>) {
        super(props)
        this.state = {
            items: props.itemsList,
        }
    }
}

type Properties<ItemType> = MinorListProperties<ItemType> & {
    itemsList: ItemType[],
}