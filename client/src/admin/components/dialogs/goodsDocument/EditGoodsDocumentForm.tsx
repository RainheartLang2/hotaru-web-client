import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import {ShipingType} from "../../../../common/beans/enums/ShipingType";
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import Stock from "../../../../common/beans/Storage";
import CounterAgent from "../../../../common/beans/CounterAgent";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";

var styles = require("../../../commonStyles.css")

export default class EditGoodsDocumentForm extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            mode: "none",
            hasErrors: false,
            type: null,
        }
    }

    render() {
        return (
            <>
                <DialogTitle>
                    Создание приходной накладной
                </DialogTitle>
                <DialogContent>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<Stock, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    label={<Message messageKey={"dialog.goods.document.field.stock.label"}/>}
                                    controller={this.props.controller}
                                    itemToString={stock => stock.name!}
                                    selectedItemProperty={"editedShipDocStock"}
                                    itemsProperty={"stocksList"}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<CounterAgent, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    label={<Message messageKey={"dialog.goods.document.field.agent.label"}/>}
                                    controller={this.props.controller}
                                    itemToString={agent => agent.name!}
                                    selectedItemProperty={"editedShipDocCounterAgent"}
                                    itemsProperty={"counterAgentsList"}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedShipDocNumber: "editedShipDocNumberField"}}
                                    label={<Message messageKey={"dialog.goods.document.field.series.label"}/>}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedShipDocDate: "editedShipDocDateField"}}
                                    label={<Message messageKey={"dialog.goods.document.field.date.label"}/>}
                                    type={"date"}
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
                        </div>
                    </div>
                    <DialogFooter
                        controller={this.props.controller}
                        submitDisabled={this.state.hasErrors}
                        onSubmitClick={() => {}}
                        onCancelClick={() => this.props.controller.closeCurrentDialog()}
                    />
                </DialogContent>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            editedShipDocType: "type",
            editedShipDocFormMode: "mode",
            editedShipDocFormHasErrors: "hasErrors",
        })
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    type: ShipingType | null,
    mode: ConfigureType,
    hasErrors: boolean
}