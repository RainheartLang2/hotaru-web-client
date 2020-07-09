import * as React from "react";
import {Drawer} from "@material-ui/core";
import EmployeeAppController from "../controller/EmployeeAppController";
import {RightPanelType} from "../state/enum/RightPanelType";
import EditPetForm from "../components/panels/petPanel/EditPetForm";
import EditGoodsPackForm from "../components/panels/goodsPack/EditGoodsPackForm";
import LoadingMoire from "../../core/components/loadingMoire/LoadingMoire";

var styles = require("./styles.css");

export default class EmployeeRightPanelContainer extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            panelType: RightPanelType.None,
            isLoading: false,
        }
    }
    
    private isRenderPanel(panelType: RightPanelType): boolean {
        return !this.state.isLoading && this.state.panelType == panelType
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
                        <LoadingMoire visible={this.state.isLoading} delay={true}/>
                        {(panelType == RightPanelType.AddPet || panelType == RightPanelType.EditPet) && <EditPetForm controller={this.props.controller}/>}
                        {(this.isRenderPanel(RightPanelType.AddGoodsPack) || this.isRenderPanel(RightPanelType.EditGoodsPack)) && <EditGoodsPackForm controller={this.props.controller}/>}
                    </div>
                </Drawer>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            rightPanelType: "panelType",
            isRightPanelLoading: "isLoading",
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
    isLoading: boolean
}