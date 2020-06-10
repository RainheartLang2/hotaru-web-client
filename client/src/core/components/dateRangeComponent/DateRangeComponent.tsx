import * as React from "react";
import {TextField} from "@material-ui/core";
import {DateUtils} from "../../utils/DateUtils";
import {Time} from "../../utils/Time";

var styles = require("./styles.css");

export default class DateRangeComponent extends React.Component<Properties> {

    static defaultProps = {
        onStartTimeChange: () => {},
        onEndTimeChange: () => {},
    }

    render() {
        return (
            <div className={styles.date}>
                <div className={styles.dateField}>
                    <TextField
                        type={"time"}
                        size={"small"}
                        fullWidth={true}
                        defaultValue={this.props.startTime
                                ? DateUtils.formatTime(this.props.startTime.getHours(), this.props.startTime.getMinutes())
                                : ""}
                        onChange={this.props.onStartTimeChange}
                    />
                </div>
                <div>
                    -
                </div>
                <div className={styles.dateField}>
                    <TextField
                        type={"time"}
                        size={"small"}
                        fullWidth={true}
                        defaultValue={this.props.endTime
                                    ? DateUtils.formatTime(this.props.endTime.getHours(), this.props.endTime.getMinutes())
                                    : ""}
                        onChange={this.props.onEndTimeChange}
                    />
                </div>
            </div>
        )
    }
}

type Properties = {
    startTime?: Time | null
    endTime?: Time | null
    onStartTimeChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onEndTimeChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}