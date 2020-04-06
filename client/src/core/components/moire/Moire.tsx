import * as React from "react";

var styles = require("./styles.css");

export default class Moire extends React.Component<MoireProps> {
    render() {
        return (
            <div className={styles.moire + " " + (this.props.visible ? "" : styles.hidden)}>
                {this.props.children}
            </div>
        )
    }
}


type MoireProps = {
    visible: boolean
}