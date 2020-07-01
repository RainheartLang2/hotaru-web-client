import {ReactNode} from "react";
import {PopoverOrigin} from "@material-ui/core";
import * as React from "react";
import Popover from "@material-ui/core/Popover";

export default class ControlledPopover extends React.Component<Properties> {
    static defaultProps = {
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
        },
    }

    render() {
        return (
            <Popover
                open={this.props.anchor != null}
                anchorEl={this.props.anchor}
                anchorOrigin={this.props.anchorOrigin}
                transformOrigin={this.props.transformOrigin}
                keepMounted
            >
                {this.props.popoverContent}
            </Popover>
        )
    }
}

type Properties = {
    anchor: Element | null
    popoverContent: ReactNode,
    anchorOrigin?: PopoverOrigin,
    transformOrigin?: PopoverOrigin,
}