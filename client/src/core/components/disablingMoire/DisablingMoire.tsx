import * as React from "react";
import {ReactNode} from "react";
import {Tooltip} from "@material-ui/core";

var styles = require("./styles.css");

export default class DisablingMoire extends React.Component<Properties> {

    render() {
        return this.props.active &&
            <Tooltip
                arrow={true}
                disableHoverListener={!this.props.tooltipLabel}
                title={this.props.tooltipLabel}>
                <div className={styles.moire}/>
            </Tooltip>
    }
}

type Properties = {
    active: boolean
    tooltipLabel?: ReactNode;
}