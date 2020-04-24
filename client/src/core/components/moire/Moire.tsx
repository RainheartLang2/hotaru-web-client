import * as React from "react";

var styles = require("./styles.css");

export default class Moire extends React.Component<Properties> {

    getHiddenClass(): string {
        return this.props.fading ? styles.fading : styles.hidden
    }

    render() {
        return (
            <div className={styles.moire +
                                " " + (this.props.visible ? "" : this.getHiddenClass()) +
                                " " + (this.props.classes ? this.props.classes : "")}
            >
                {this.props.children}
            </div>
        )
    }
}

type Properties = {
    classes?: string
    visible: boolean
    fading?: boolean
}