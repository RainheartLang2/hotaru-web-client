import * as React from "react";
import {AppHeader} from "../../../core/components";
import {MuiThemeProvider} from "@material-ui/core";

var styles = require("./styles.css");

export default class ApplicationHeader extends React.Component<Properties> {
    render() {
        return (<AppHeader position={"static"}>
            <div className={styles.applicationHeader}>
                <div className={styles.navigationMenu}>
                    {this.props.children}
                </div>
                <div className={styles.profileAreaWrapper}>
                    <div className={styles.profileArea}>
                        <div className={styles.userName} onClick={() => this.props.onUserNameClick()}>
                            {this.props.userName}
                        </div>
                        <div className={styles.profileSeparator}/>
                        <div className={styles.logout} onClick={() => this.props.onLogOutClick()}>
                            Выйти
                        </div>
                    </div>
                </div>
            </div>

        </AppHeader>)
    }
}

type Properties = {
    userName: string,
    onUserNameClick: () => void;
    onLogOutClick: () => void;
}