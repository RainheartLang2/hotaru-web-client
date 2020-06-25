import * as React from "react";
import {Drawer} from "@material-ui/core";
import EmployeeAppController from "../controller/EmployeeAppController";
import {RightPanelType} from "../state/enum/RightPanelType";
import EditPetForm from "../components/panels/petPanel/EditPetForm";

var styles = require("./styles.css");

export default class EmployeeRightPanelContainer extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            panelType: RightPanelType.None,
        }
    }

    render() {
        const panelType = this.state.panelType
        return (
            <>
                <Drawer
                    open={panelType != RightPanelType.None}
                    onClose={() => this.props.controller.closeCurrentRightPanel()}
                    anchor={"right"}
                >
                    <div className={styles.drawerContent}>
                        {(panelType == RightPanelType.AddPet || panelType == RightPanelType.EditPet) && <EditPetForm controller={this.props.controller}/>}
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