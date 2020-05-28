import * as React from "react";
import {ReactNode} from "react";

var styles = require("./styles.css")

export default class LeftMenu extends React.Component<Properties> {
    render() {
        return (
            <div className={styles.listWrapper}>
                {this.props.entries.map(entry => {
                    return (
                        <div className={styles.entry} onClick={() => entry.onClick()}>
                            {entry.label}
                        </div>
                    )
                })}
            </div>
        )
    }
}

type Properties = {
    entries: Entry[]
}

type Entry = {
    label: ReactNode,
    onClick: Function,
}
