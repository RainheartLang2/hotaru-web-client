import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {Message} from "../../../../core/components/Message";
import CustomButton from "../../../../core/components/customButton/CustomButton";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import EmployeeApplicationStore, {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import SalesUnit from "../../../../common/beans/SalesUnit";
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import {TextField} from "@material-ui/core";
import GoodsProducer from "../../../../common/beans/GoodsProducer";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import MeasureUnit from "../../../../common/beans/MeasureUnit";

var styles = require("../../../commonStyles.css");

export default class EditGoodsPackForm extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            measureUnit: null,
            hasErrors: false,
            cost: null,
            mode: "none",
        }
    }

    private submitForm() {
        if (this.state.mode == "create") {
            this.props.controller.goodsDocumentActions.submitCreateGoodsPackForDocument()
        } else if (this.state.mode == "edit") {
            this.props.controller.goodsDocumentActions.submitEditGoodsPackForDocument()
        }
    }

    render() {
        return (
            <>
                <div>
                    <div className={styles.rightPanelTitle}>
                        <Message messageKey={"panel.goodsPack.title"}/>
                    </div>
                    <div className={styles.rightPanelContent}>
                        <div className={styles.rightPanelRow}>
                            <ConnectedAutoCompleteField<SalesUnit, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                itemToString={unit => unit.name}
                                controller={this.props.controller}
                                selectedItemProperty={"editedGoodsPackSalesType"}
                                itemsProperty={"goodsSalesUnitList"}
                                label={<Message messageKey={"panel.goodsPack.salesUnit.field.label"}/>}
                                required={true}
                            />
                        </div>
                        <div className={styles.rightPanelRow}>
                            <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                controller={this.props.controller}
                                fieldKey={{editedGoodsPackAmount: "editedGoodsPackAmountField"}}
                                type={"number"}
                                label={<Message messageKey={"panel.goodsPack.amount.field.label"}
                                                args={[this.state.measureUnit ? `(${this.state.measureUnit.name})` : ""]}/>}
                            />
                        </div>
                        <div className={styles.rightPanelRow}>
                            <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                controller={this.props.controller}
                                fieldKey={{editedGoodsPackUnitPrice: "editedGoodsPackUnitPriceField"}}
                                type={"number"}
                                label={<Message messageKey={"panel.goodsPack.price.field.label"} args={[""]}/>}
                            />
                        </div>
                        <div className={styles.rightPanelRow}>
                            <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                controller={this.props.controller}
                                fieldKey={{editedGoodsPackTaxRate: "editedGoodsPackTaxRateField"}}
                                type={"number"}
                                label={<Message messageKey={"panel.goodsPack.taxRate.field.label"} args={[""]}/>}
                            />
                        </div>
                        <div className={styles.rightPanelRow}>
                            <TextField
                                size={"small"}
                                fullWidth={true}
                                disabled={true}
                                value={this.state.cost != null ? this.state.cost : "N/A"}
                                label={<Message messageKey={"panel.goodsPack.cost.field.label"}/>}
                            />
                        </div>
                        <div className={styles.rightPanelRow}>
                            <ConnectedAutoCompleteField<GoodsProducer, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                itemToString={producer => producer.name!}
                                controller={this.props.controller}
                                selectedItemProperty={"editedGoodsPackProducer"}
                                itemsProperty={"goodsProducersList"}
                                label={<Message messageKey={"panel.goodsPack.producer.field.label"}/>}
                            />
                        </div>
                        <div className={styles.rightPanelRow}>
                            <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                controller={this.props.controller}
                                fieldKey={{editedGoodsPackSeries: "editedGoodsPackSeriesField"}}
                                label={<Message messageKey={"panel.goodsPack.series.field.label"} args={[""]}/>}
                            />
                        </div>
                        <div className={styles.rightPanelRow}>
                            <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                controller={this.props.controller}
                                fieldKey={{editedGoodsPackCreationDate: "editedGoodsPackCreationDateField"}}
                                label={<Message messageKey={"panel.goodsPack.creationDate.field.label"} args={[""]}/>}
                                type={"date"}
                            />
                        </div>
                        <div className={styles.rightPanelRow}>
                            <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                controller={this.props.controller}
                                fieldKey={{editedGoodsPackExpirationDate: "editedGoodsPackExpirationDateField"}}
                                label={<Message messageKey={"panel.goodsPack.expirationDate.field.label"} args={[""]}/>}
                                type={"date"}
                            />
                        </div>
                    </div>
                    <div>
                        <CustomButton
                            controller={this.props.controller}
                            onClick={() => this.submitForm()}
                            disabled={this.state.hasErrors}
                        >
                            <Message messageKey={"common.button.save"}/>
                        </CustomButton>
                    </div>
                </div>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            editedGoodsPackFormMode: "mode",
            editedGoodsPackCost: "cost",
            editedGoodsPackFormHasErrors: "hasErrors",
            editedGoodsPackFormMeasureUnit: "measureUnit"
        })
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

export type Properties = {
    controller: EmployeeAppController
}

export type State = {
    measureUnit: MeasureUnit | null
    mode: ConfigureType
    hasErrors: boolean
    cost: number | null
}
