import * as React from "react";
import CustomPopover from "../customPopover/CustomPopover";
import {ReactNode} from "react";
import {MenuItem, PopoverOrigin} from "@material-ui/core";

export default class DropDownMenu<OnClickData = void> extends React.Component<Properties<OnClickData>, State> {

    private popover: CustomPopover | null = null

    static defaultProps = {
        getRef: (popover: CustomPopover) => {},
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

    private close() {
        if (this.popover) {
            this.popover.close()
        }
    }

    private getMenuComponent(): ReactNode {
        return (<>
            {this.props.items.map(item => {
                return (
                    <MenuItem onClick={() => {
                        item.onClick(this.props.onclickArgument)
                        this.close()
                    }}>
                        {item.label}
                    </MenuItem>
                )
            })}
        </>)
    }

    render() {
        return (
            <CustomPopover
                popoverContent={() => this.getMenuComponent()}
                getRef={popover => {
                    this.popover = popover
                    this.props.getRef(popover)
                }}
                disabled={this.props.disabled}
                anchorOrigin={this.props.anchorOrigin}
                transformOrigin={this.props.transformOrigin}
                onClose={this.props.onClose}
                className={this.props.className}
            >
                {this.props.children}
            </CustomPopover>

        )
    }
}

type Properties<OnClickData> = {
    items: DropDownMenuItem<OnClickData>[]
    getRef: (popover: CustomPopover) => void,
    onclickArgument: OnClickData,
    disabled: boolean,
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    onClose: Function,
    className: string,
}

type State = {

}

export type DropDownMenuItem<OnClickData = void> = {
    label: ReactNode
    onClick: (data: OnClickData) => void
}
