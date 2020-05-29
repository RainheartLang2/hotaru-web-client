import * as React from "react";
import {ReactNode} from "react";

var styles = require("./styles.css")

export default class LeftMenu extends React.Component<Properties> {

    private isEntrySelected(entry: LeftMenuEntry): boolean {
        return this.props.selectedEntryKey == entry.key
    }

    render() {
        return (
            <div className={styles.listWrapper}>
                {this.props.entries.map(entry => {
                    return (
                        <div className={styles.entry + " " + (this.isEntrySelected(entry) ? styles.selectedEntry : "")} onClick={() => {
                            if (!this.isEntrySelected(entry))
                            entry.onClick()
                        }}>
                            {entry.label}
                        </div>
                    )
                })}
            </div>
        )
    }
}

type Properties = {
    entries: LeftMenuEntry[],
    selectedEntryKey: number | null,
}

export type LeftMenuEntry = {
    key: number,
    label: ReactNode,
    onClick: Function,
}
