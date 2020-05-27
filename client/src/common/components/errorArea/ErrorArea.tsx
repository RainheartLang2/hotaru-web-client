import * as React from "react";
import {ReactNode} from "react";

var styles = require("./styles.css")

export default class ErrorArea extends React.Component<Properties> {
    render() {
        return (
            <div className={styles.errorsArea}>
                {this.props.message}
            </div>
        )
    }
}

type Properties =  {
    message: ReactNode,
}