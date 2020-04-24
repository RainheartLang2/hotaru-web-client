import * as React from "react";
import Moire from "../moire/Moire";
import {CircularProgress} from "@material-ui/core";

var styles = require("./styles.css");

export default class LoadingMoire extends React.Component<Properties> {
    render() {
        return (
            <Moire
                classes={this.props.delay ? styles.delayedMoire : ""}
                visible={this.props.visible}
                fading={this.props.fading}
            >
                {this.props.visible ? <CircularProgress color="primary"/> : ""}
            </Moire>
        )
    }
}

type Properties = {
    visible: boolean,
    fading?: boolean,
    delay?: boolean,
}