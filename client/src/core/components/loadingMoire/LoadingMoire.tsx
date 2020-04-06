import * as React from "react";
import Moire from "../moire/Moire";
import {Loader} from "../../components";

export default class LoadingMoire extends React.Component<LoadingMoireProps> {
    render() {
        return (
            <Moire visible={this.props.visible}>
                {this.props.visible ? <Loader color="primary"/> : ""}
            </Moire>
        )
    }
}

type LoadingMoireProps = {
    visible: boolean,
}