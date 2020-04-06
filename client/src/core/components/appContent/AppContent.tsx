import * as React from "react";

var styles = require("./styles.css");

export default class AppContent extends React.Component<AppContentProps> {

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

type AppContentProps = {
    visible: boolean
}