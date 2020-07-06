import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import {StockType} from "../../../../common/beans/enums/StockType";
import Stock from "../../../../common/beans/Storage";
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import {Clinic} from "../../../../common/beans/Clinic";
import {Employee} from "../../../../common/beans/Employee";
import {NameUtils} from "../../../../core/utils/NameUtils";

var styles = require("./styles.css")

export default class EditStockForm extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            mode: "none",
            hasErrors: false,
        }
    }

    private getTitleMessageKey(): string {
        switch (this.state.mode) {
            case "create":
                return "dialog.stock.create.label"
            case "edit":
                return "dialog.stock.edit.label"
            default:
                return "dialog.stock.create.label"
        }
    }

    private submitForm(): void {
        const mode = this.state.mode
        const actions = this.props.controller.stockActions
        if (mode == "create") {
            actions.submitCreate()
        } else if (mode == 'edit') {
            actions.submitEdit()
        } else {
            throw new Error('unknown value of mode ' + mode)
        }
    }

    render() {
        return (
            <>
                <DialogTitle>
                    <Message messageKey={this.getTitleMessageKey()}
                    />
                </DialogTitle>
                <DialogContent>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedStockName: "editedStockNameField"}}
                                    label={(<Message messageKey={"dialog.stock.name.field.label"}/>)}
                                    required={true}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedSelect<StockType, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    mapProperty={"stockTypes"}
                                    selectedItemProperty={"editedStockType"}
                                    itemToString={stockType => StockType.stockTypeToString(stockType)}
                                    getKey={stockType => stockType ? StockType.stockTypeToNumber(stockType) : 0}
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<Clinic, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    label={<Message messageKey={"dialog.stock.clinic.field.label"}/>}
                                    controller={this.props.controller}
                                    itemToString={clinic => clinic.name!}
                                    selectedItemProperty={"editedStockClinic"}
                                    itemsProperty={"clinicList"}
                                    onChange={clinic => this.props.controller.setState({editedStockEmployee: null})}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<Employee, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    label={<Message messageKey={"dialog.stock.responsible.field.label"}/>}
                                    controller={this.props.controller}
                                    itemToString={employee => NameUtils.formatName(employee)}
                                    itemsProperty={"editedStockUsersForSelectedClinic"}
                                    selectedItemProperty={"editedStockEmployee"}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter
                        controller={this.props.controller}
                        submitDisabled={this.state.hasErrors}
                        onSubmitClick={() => {this.submitForm()}}
                        onCancelClick={() => this.props.controller.closeCurrentDialog()}
                    />
                </DialogContent>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            stockDialogMode: "mode",
            stockFormHasErrors: "hasErrors"
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
    mode: ConfigureType,
    hasErrors: boolean,
}