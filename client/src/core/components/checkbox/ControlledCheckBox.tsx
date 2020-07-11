import CustomCheckBoxBase, {CustomCheckBoxProps} from "./CustomCheckBoxBase";

export default class ControlledCheckBox extends CustomCheckBoxBase<Properties> {
    protected isChecked(): boolean {
        return this.props.checked;
    }

    protected onChange(value: boolean): void {
        this.props.onChange(value)
    }
}

export type Properties = CustomCheckBoxProps & {
    checked: boolean
    onChange: (value: boolean) => void
}