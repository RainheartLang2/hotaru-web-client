import * as React from "react";
import {Message} from "../Message";

var styles = require("./styles.css");

export default class ActivityCell extends React.Component<Properties> {

    private getActiveLabelKey(isActive?: boolean): string {
        return isActive
            ? "dialog.employee.control.active.label"
            : "dialog.employee.control.notActive.label"
    }

    render() {
        const isActive = this.props.isActive
        return (
            <div className={isActive ? styles.activeLabel : styles.notActiveLabel}>
                <Message messageKey={this.getActiveLabelKey(isActive)}/>
            </div>
        )
    }
}

type Properties = {
    isActive?: boolean
}