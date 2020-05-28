import * as React from "react";

var styles = require("./styles.css");

export default class AppContent extends React.Component<Properties> {

    static defaultProps = {
        visible: true,
        leftMenuContainer: "",
        leftMenuVisible: true,
    }

    render() {
        return (
            <div className={styles.superWrapper}>
                {this.props.leftMenuVisible && this.props.leftMenuContainer}
                <div className={styles.appContentWrapper}>
                    <div className={styles.appContent}>
                        {this.props.pageVisible ? this.props.children : ""}
                    </div>
                </div>
            </div>
        )
    }
}

type Properties = {
    pageVisible: boolean
    leftMenuContainer: React.Component
    leftMenuVisible: boolean
}