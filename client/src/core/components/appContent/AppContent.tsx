import * as React from "react";
import {ReactNode} from "react";

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
                {this.props.pageVisible
                    && <>
                        {this.props.leftMenuVisible &&
                        <div className={styles.leftMenuWrapper}>
                            {this.props.leftMenuContainer}
                        </div>
                        }
                        <div className={styles.appContentWrapper}>
                            <div className={styles.appContent}>
                                {this.props.children}
                            </div>
                        </div>
                       </>}
            </div>
        )
    }
}

type Properties = {
    pageVisible: boolean
    leftMenuContainer: ReactNode
    leftMenuVisible: boolean
}