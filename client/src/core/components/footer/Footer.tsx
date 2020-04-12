import * as React from "react";
import {useTheme} from "@material-ui/core";

var styles = require("./styles.css");

export default class Footer extends React.Component {
    render() {
        return (<FooterRaw></FooterRaw>)
    }
}

function FooterRaw() {
    const color = {
        background: useTheme().palette.primary.main,
    }
    return (<div className={styles.footer} style={color}/>)
}