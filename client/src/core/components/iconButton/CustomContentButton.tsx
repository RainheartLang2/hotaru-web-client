import * as React from "react";
import {Tooltip} from "@material-ui/core";
import {ReactNode} from "react";

var styles = require("./styles.css");

export default class CustomContentButton extends React.Component<Properties> {

    render() {
        return (
            <Tooltip
                arrow={true}
                title={this.props.tooltipContent}
            >
                <div className={styles.iconWrapper} onClick={() => this.props.onClick()}>
                    {this.props.children}
                </div>
            </Tooltip>

        )
    }
}

type Properties = {
    onClick: Function,
    tooltipContent: ReactNode,
}