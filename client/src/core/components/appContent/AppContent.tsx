import * as React from "react";
var styles = require("./styles.css");

export default class AppContent extends React.Component {
    render() {
        return (<div className={styles.appContent}>
            {this.props.children}
        </div>)
    }
}