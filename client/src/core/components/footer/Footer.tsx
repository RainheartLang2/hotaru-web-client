import * as React from "react";
import {CURRENT_THEME} from "../../../admin/AdminApp";

export default class Footer extends React.Component {
    render() {
        //TODO: change styling
        const styles = {
            footer: {
                background: CURRENT_THEME.palette.primary.main,
                height: 50,
            }
        }
        return (<div style={styles.footer}/>)
    }
}