import * as React from "react";
import {Tooltip} from "@material-ui/core";
import {ReactNode} from "react";

var styles = require("./styles.css");

export default class CustomContentButton extends React.Component<Properties> {

    static defaultProps = {
        disabled: false,
        tooltipLabel: "",
    }

    private getContentStyles(): string {
        return styles.iconWrapper
            + (this.props.disabled
                ? (" " + styles.disabled)
                : " " + styles.enabled)
    }

    render() {
        return (
            <Tooltip
                arrow={true}
                title={this.props.tooltipContent}
            >
                <div
                    className={this.getContentStyles()}
                    onClick={() => {
                    if (!this.props.disabled) {
                        this.props.onClick()
                    }
                }}>
                    {this.props.children}
                </div>
            </Tooltip>
        )
    }
}

type Properties = {
    onClick: Function,
    tooltipContent: NonNullable<React.ReactNode>,
    disabled: boolean,
}