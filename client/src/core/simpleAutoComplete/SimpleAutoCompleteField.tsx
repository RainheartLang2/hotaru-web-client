import CustomAutoCompleteField, {CustomAutoCompleteProps} from "../components/customAutoComplete/CustomAutoCompleteField";

export default class SimpleAutoCompleteField<ItemType> extends CustomAutoCompleteField<ItemType, Properties<ItemType>> {
    constructor(props: Properties<ItemType>) {
        super(props)
        this.state = {
            options: this.props.items,
            selectedItem: this.props.defaultValue,
            changed: false,
        }
    }

    protected setValue(value: ItemType | null): void {
        this.setState({
            selectedItem: value,
        })
    }

}

type Properties<ItemType> = CustomAutoCompleteProps<ItemType>
& {
    items: ItemType[],
    defaultValue: ItemType | null,
}