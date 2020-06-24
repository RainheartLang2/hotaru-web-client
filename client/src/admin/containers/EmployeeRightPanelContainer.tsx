import * as React from "react";
import {Drawer} from "@material-ui/core";
import EmployeeAppController from "../controller/EmployeeAppController";
import {RightPanelType} from "../state/enum/RightPanelType";

var styles = require("./styles.css");

export default class EmployeeRightPanelContainer extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            panelType: RightPanelType.None,
        }
    }

    render() {
        console.log("renderContainer")
        console.log(this.state.panelType == RightPanelType.Pet)
        return (
            <>
                <Drawer
                    open={this.state.panelType == RightPanelType.Pet}
                    onClose={() => this.props.controller.closeCurrentRightPanel()}
                    anchor={"right"}
                >
                    <div className={styles.drawerContent}>
                    </div>
                </Drawer>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            rightPanelType: "panelType",
        })
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    panelType: RightPanelType
}