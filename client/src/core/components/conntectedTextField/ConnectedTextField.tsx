import * as React from "react";
import {TextField} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import {Field} from "../../mvc/store/Field";
import MaskTransformer from "../../utils/MaskTransformer";
import ApplicationController from "../../mvc/controllers/ApplicationController";
import ApplicationStore, {DefaultStateType} from "../../mvc/store/ApplicationStore";
import {CommonUtils} from "../../utils/CommonUtils";
import {StringUtils} from "../../utils/StringUtils";
import DifferenceType = StringUtils.DifferenceType;

const EmptyCharacter = "_"

export default class ConnectedTextField<StateType extends DefaultStateType,
                                            SelectorsType,
                                            StoreType extends ApplicationStore<StateType, SelectorsType>>
    extends React.Component<Properties<StateType, SelectorsType, StoreType>, State> {

    static defaultProps = {
        size: "small",
        fullWidth: true,
    }

    private prevValue: string
    private maskTransformer: MaskTransformer = new MaskTransformer("")

    constructor(props: Properties<StateType, SelectorsType, StoreType>) {
        super(props)
        this.checkFieldKey()
        if (props.mask) {
            this.maskTransformer = new MaskTransformer(props.mask, EmptyCharacter, "*")
        }
        this.prevValue = this.props.defaultValue || "",
        this.state = {
            field: {
                value: this.props.defaultValue || "",
                errors: [],
                validators: [],
                validationActive: false,
            }
        }
    }

    private checkFieldKey(): void {
        //TODO: implement
    }

    private getTooltipText(): NonNullable<React.ReactNode> {
        return (
            <>
                {this.state.field.errors.map((errorText, index) => {
                    return (<div key={index}>{errorText}</div>)
                })}
            </>
        )
    }

    private getKeys(): [keyof StateType, keyof SelectorsType] {
        for (let originalFieldKey in this.props.fieldKey) {
            const originalKey = originalFieldKey as keyof StateType
            const selectorFieldKey = this.props.fieldKey[originalFieldKey] as keyof SelectorsType
            return [originalKey, selectorFieldKey]
        }
        throw new Error("No field key property")
    }

    private hasErrors(): boolean {
        return this.state.field.validationActive
            && this.state.field.errors.length > 0
    }

    private postValueChangeToStore(value: string): void {
        const keys = this.getKeys()
        this.props.controller
            .setState({[keys[0]]: value} as unknown as Partial<StateType>)
        this.props.controller.toggleFieldValidation(keys[1], true)
    }

    private insertCharactersToMask(value: string,
                                   addedCharacters: string,
                                   position: number,
                                   size: number): string {
        let potentialPosition = position
        let result = value
        for (let i = 0; i < size; i++) {
            if (potentialPosition != -1) {
                const nextMaskedCharacterPosition = this.maskTransformer.getNextMaskedCharacterPosition(potentialPosition)
                if (nextMaskedCharacterPosition == -1) {
                    potentialPosition = -1
                } else {
                    result = StringUtils.setCharAt(result, nextMaskedCharacterPosition, addedCharacters.charAt(i))
                }
                potentialPosition = nextMaskedCharacterPosition + 1
            }
        }
        return result
    }

    private handleAddition(value: string,
                           position: number,
                           size: number
    ): string {
        const addedCharacters = value.substr(position, position + size)
        const settedValue = StringUtils.deleteChars(value, position, size)
        return this.insertCharactersToMask(settedValue, addedCharacters, position, size)
    }

    private handleDeletion(value: string,
                           position: number,
                           size: number
    ): string {
        return this.maskTransformer.restoreMaskedValueAfterDeletion(value, position, size)
    }

    private onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        let settedValue = event.target.value

        if (this.props.mask) {
            const difference = StringUtils.getDifference(this.prevValue, event.target.value)
            if (difference.type == DifferenceType.None || difference.type == DifferenceType.Unknown) {
                return
            }

            let caretPosition = 0
            if (event.target.selectionEnd == null) {
                throw new Error("selectionEnd can not be null, while input is changed")
            }
            if (difference.type == DifferenceType.Addition) {
                caretPosition = event.target.selectionEnd - difference.size
                caretPosition += this.maskTransformer.getMaskedDistance(caretPosition, difference.size)
                settedValue = this.handleAddition(settedValue, difference.position, difference.size)
            } else if (difference.type == DifferenceType.Deletion) {
                if (difference.size == 1) {
                    const position = this.maskTransformer.getPreviousMaskedCharacterPosition(difference.position)
                    if (position != -1) {
                        settedValue = StringUtils.setCharAt(this.prevValue, position, EmptyCharacter)
                        caretPosition = position
                    }
                } else {
                    caretPosition = event.target.selectionEnd
                    settedValue = this.handleDeletion(settedValue, difference.position, difference.size)
                }
            }
            event.target.value = settedValue
            event.target.selectionStart = event.target.selectionEnd = this.maskTransformer.getNextMaskedCharacterPosition(caretPosition)
            settedValue = this.maskTransformer.unmaskValue(settedValue)
        }
        this.postValueChangeToStore(settedValue)
    }

    private getValue(): string {
        const value = this.state.field.value
        return this.props.mask
            ? this.maskTransformer.maskValue(value)
            : value
    }

    render() {
        this.prevValue = this.getValue()
        return (
            <>
                <Tooltip
                    arrow={true}
                    title={this.getTooltipText()}
                    PopperProps={{
                        style: {
                            visibility: this.hasErrors() ? "visible" : "hidden",
                        }
                    }}
                >
                    <TextField
                        label={this.props.label}
                        size={this.props.size != null ? this.props.size : 'small'}
                        fullWidth={this.props.fullWidth != null ? this.props.fullWidth : true}
                        rows={this.props.rows}
                        type={this.props.type ? this.props.type : "text"}
                        variant={this.props.variant ? this.props.variant : "standard"}
                        disabled={this.props.disabled != null ? this.props.disabled : false}
                        value={this.getValue()}
                        error={this.hasErrors()}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.onChange(event)}
                    />
                </Tooltip>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, CommonUtils.createLooseObject([[this.getKeys()[1], "field"]]))
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type FieldCorrelationRecord<StateType, SelectorsType> = {
    [P in keyof StateType]: keyof SelectorsType
}

export type FieldInfo<StateType, SelectorsType> = Partial<FieldCorrelationRecord<StateType, SelectorsType>>

type Properties<StateType extends DefaultStateType, DerivationType, StoreType extends ApplicationStore<StateType, DerivationType>> = {
    controller: ApplicationController<StateType, DerivationType, StoreType>,
    fieldKey: FieldInfo<StateType, DerivationType>,
    label?: React.ReactNode,
    disabled?: boolean,
    required?: boolean,
    size?: 'small' | 'medium',
    fullWidth?: boolean,
    mask?: string,
    rows?: number,
    defaultValue?: string,
    type?: "text" | "password" | "time" | "date",
    variant?: "standard" | "filled" | "outlined"
}

type State = {
    field: Field
}

type ChangeHandleResult = {
    caretPosition: number,
    value: string,
}