import * as React from "react";
import CustomPopover from "../customPopover/CustomPopover";
import {PopoverOrigin} from "@material-ui/core";
import {ReactNode} from "react";
import TextField from "@material-ui/core/TextField";
import CustomButton from "../customButton/CustomButton";
import {Message} from "../Message";
import ControlledCheckBox from "../checkbox/ControlledCheckBox";

var styles = require("./styles.css")
export default class Selector<ItemType> extends React.Component<Properties<ItemType>, State<ItemType>> {

    private popover: CustomPopover | null

    constructor(props: Properties<ItemType>) {
        super(props)
        this.popover = null
        this.state = {
            selectedItems: [],
            filter: "",
        }
    }

    static defaultProps = {
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
        },
        disabled: false,
        onClose: () => {},
        className: "",
    }

    private getItemsToShow(): ItemType[] {
        return this.props.items.filter(item => !this.state.filter
                                                        || this.props.itemToString(item).indexOf(this.state.filter) >= 0)
    }

    private close(): void {
        if (this.popover) {
            this.popover.close()
        }
    }

    private getSelectorContent(): ReactNode {
        return (
            <div className={styles.main}>
                <div className={styles.label}>
                    {this.props.label}
                </div>
                <div className={styles.content}>
                    <div className={styles.filter}>
                        <div className={styles.filterField}>
                            <TextField
                                size={"small"}
                                variant={"filled"}
                                fullWidth={true}
                                value={this.state.filter}
                                onChange={event => {
                                    this.setState({filter: event.target.value})
                                }}
                            />
                        </div>
                        <div className={styles.filterButtons}>
                        </div>

                    </div>
                    <div className={styles.list}>
                        {this.getItemsToShow().map(item => {
                            return (<>
                                <div className={styles.listItem}>
                                    <ControlledCheckBox
                                        checked={this.state.selectedItems.includes(item)}
                                        label={this.props.itemToString(item)}
                                        onChange={value => {
                                            this.setState({
                                                selectedItems: value
                                                    ? [...this.state.selectedItems, item]
                                                    : this.state.selectedItems.filter(selected => selected != item)
                                            })
                                        }}
                                    />
                                </div>
                                <div className={styles.separator}/>
                            </>)
                        })}
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.buttons}>
                        <CustomButton
                            color={"primary"}
                            onClick={() => {
                                this.props.onSelectButtonClick(this.state.selectedItems)
                                this.close()
                            }}
                        >
                            <Message messageKey={"common.button.select"}/>
                        </CustomButton>
                        <CustomButton
                            color={"secondary"}
                            onClick={() => this.close()}
                        >
                            <Message messageKey={"common.button.close"}></Message>
                        </CustomButton>
                    </div>
                </div>
            </div>

        )
    }

    render() {
            return (
                <CustomPopover
                popoverContent={() => this.getSelectorContent()}
                getRef={popover => this.popover = popover}
                disabled={this.props.disabled}
                anchorOrigin={this.props.anchorOrigin}
                transformOrigin={this.props.transformOrigin}
                onClose={this.props.onClose}
                >
                    {this.props.children}
                </CustomPopover>
            )
        }
}

type Properties<ItemType> = {
    items: ItemType[]
    itemToString: (item: ItemType) => string
    label: ReactNode
    disabled: boolean
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    onClose: Function,
    className: string,
    onSelectButtonClick: (items: ItemType[]) => void,
}

type State<ItemType> = {
    filter: string
    selectedItems: ItemType[]
}