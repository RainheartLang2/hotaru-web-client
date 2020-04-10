import * as React from "react";
import Moire from "../moire/Moire";
import {CircularProgress} from "@material-ui/core";

export default class LoadingMoire extends React.Component<LoadingMoireProps> {
    render() {
        return (
            <Moire visible={this.props.visible}>
                {this.props.visible ? <CircularProgress color="primary"/> : ""}
            </Moire>
        )
    }
}

type LoadingMoireProps = {
    visible: boolean,
}