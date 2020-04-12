import * as React from "react";

var styles = require("./styles.css");

export default class AppContent extends React.Component<Properties> {

    static defaultProps = {
        visible: true,
    }

    render() {
        return (
            <div className={styles.appContentWrapper}>
                <div className={styles.appContent}>
                    {this.props.visible ? this.props.children : ""}
                </div>
            </div>
        )
    }
}

type Properties = {
    visible: boolean
}