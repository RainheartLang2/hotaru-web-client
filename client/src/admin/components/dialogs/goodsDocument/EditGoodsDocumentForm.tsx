import * as React from "react";
import {ReactNode} from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {DialogContent, DialogTitle, ListItemText} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import {ShipingType} from "../../../../common/beans/enums/ShipingType";
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../state/EmployeeApplicationStore";
import Stock from "../../../../common/beans/Storage";
import CounterAgent from "../../../../common/beans/CounterAgent";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import ConnectedMinorList from "../../../../common/components/list/connected/ConnectedMinorList";
import GoodsPackWithPrice from "../../../../common/beans/GoodsPackWithPrice";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CustomContentButton from "../../../../core/components/iconButton/CustomContentButton";
import DeleteIcon from '@material-ui/icons/DeleteSharp';
import EditIcon from '@material-ui/icons/EditSharp';

import {MathUtils} from "../../../../core/utils/MathUtils";
import DocumentDialogFooter from "../../../../core/components/dialogFooter/DocumentDialogFooter";
import {DocumentState} from "../../../../common/beans/enums/DocumentState";
import MessageResource from "../../../../core/message/MessageResource";
import ValidatedTextField from "../../../../core/components/validatedTextField/ValidatedTextField";
import SalesUnit from "../../../../common/beans/SalesUnit";
import MeasureUnit from "../../../../common/beans/MeasureUnit";
import {SalesUtils} from "../../../../core/utils/SalesUtils";
import Selector from "../../../../core/components/selector/Selector";
import GoodsPack from "../../../../common/beans/GoodsPack";
import DigitsOnlyValidator from "../../../../core/mvc/validators/DigitsOnlyValidator";
import MaximalLengthValidator from "../../../../core/mvc/validators/MaximalLengthValidator";

var styles = require("../../../commonStyles.css")
var specificStyles = require("./styles.css")

export default class EditGoodsDocumentForm extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            hasErrors: false,
            type: null,
            documentState: null,
            stockGoodsForSelector: [],
        }
    }

    private renderGoodsPackName(item: GoodsPackWithPrice): ReactNode {
        const salesUnit = this.props.controller.salesUnitActions.getUnitById(item.goodsTypeId)
        const measureUnit = this.props.controller.dictionariesActions.getMeasureUnitById(salesUnit.measureUnitId)
        return (<>
                <ListItemText primary={salesUnit.name + " (" + measureUnit.name + ")"}
                              secondary={this.state.type == ShipingType.Income
                                            ? this.renderIncomeGoodsPackSubName(item, salesUnit, measureUnit)
                                            : this.renderOutcomeGoodsPackSubName(item)}
                />
            </>)
    }

    private renderIncomeGoodsPackSubName(item: GoodsPackWithPrice, salesUnit: SalesUnit, measureUnit: MeasureUnit): ReactNode {
        return (<Message messageKey={"dialog.goods.document.goodsList.income.subname.template"}
                         args={[
                                item.amount.toString(),
                                measureUnit.name!,
                                item.price.toString(),
                                MathUtils.calculateCost(item.amount, item.price, item.taxRate).toString()
                                ]}/>)
    }

    private renderOutcomeGoodsPackSubName(item: GoodsPackWithPrice): ReactNode {
        return SalesUtils.formatSeriesAndExpirationDate(item)
    }

    private getPackNameForSelector(item: GoodsPack): string {
        const salesUnit = this.props.controller.salesUnitActions.getUnitById(item.goodsTypeId)
        const measureUnit = this.props.controller.dictionariesActions.getMeasureUnitById(salesUnit.measureUnitId)
        return this.getPackName(salesUnit, measureUnit) + " " + SalesUtils.formatSeriesAndExpirationDate(item)
    }

    private getPackName(salesUnit: SalesUnit, measureUnit: MeasureUnit) {
        return salesUnit.name + " (" + measureUnit.name + ")"
    }

    private renderGoodsListItem(item: GoodsPackWithPrice): ReactNode {
        const editable = this.state.type == ShipingType.Income
        const editAmount = this.state.type == ShipingType.Outcome
        return (<>
            {this.renderGoodsPackName(item)}
            <ListItemSecondaryAction>
                <div className={styles.actions}>
                    {editable &&
                        <CustomContentButton
                            onClick={() => this.props.controller.goodsDocumentActions.openEditGoodsPackRightPanel(item)}
                            tooltipContent={<Message messageKey={"common.button.edit"}/>}
                        >
                            <EditIcon/>
                        </CustomContentButton>
                    }
                    {editAmount &&
                        <div className={specificStyles.amountField}>
                            <ValidatedTextField
                                validators={[new DigitsOnlyValidator(), new MaximalLengthValidator(15)]}
                                onValidBlur={event => {this.props.controller.goodsDocumentActions.setGoodsPackAmount(item, +event.target.value)}}
                                value={item.amount}
                                variant={"outlined"}
                            />
                        </div>
                    }
                    <CustomContentButton
                        onClick={() => this.props.controller.goodsDocumentActions.deleteGoodsPackForDocument(item.id!)}
                        tooltipContent={<Message messageKey={"common.button.delete"}/>}
                    >
                        <DeleteIcon/>
                    </CustomContentButton>
                </div>
            </ListItemSecondaryAction>
        </>)
    }

    private onSubmitButton() {
        if (this.state.documentState == null) {
            this.props.controller.goodsDocumentActions.submitCreateIncomeDocument(false)
        } else if (this.state.documentState == DocumentState.Saved) {
            this.props.controller.goodsDocumentActions.submitEditIncomeDocument(false)
        }
    }

    private onExecuteButton() {
        if (this.state.documentState == null) {
            this.props.controller.goodsDocumentActions.submitCreateIncomeDocument(true)
        } else if (this.state.documentState == DocumentState.Saved) {
            this.props.controller.goodsDocumentActions.submitEditIncomeDocument(true)
        }
    }

    private getDocumentStateText(): string {
        switch (this.state.documentState) {
            case null: return ""
            case DocumentState.Saved: return MessageResource.getMessage("dialog.goods.document.saved.label")
            case DocumentState.Executed: return MessageResource.getMessage("dialog.goods.document.executed.label")
            case DocumentState.Canceled: return MessageResource.getMessage("dialog.goods.document.canceled.label")
            default: throw new Error("unknown document state " + this.state.documentState)
        }
    }

    private getLabelKey(): string {
        if (this.state.type == ShipingType.Income) {
            return "dialog.goods.document.income.label"
        } else {
            return "dialog.goods.document.outcome.label"
        }
    }

    render() {
        const formDisabled = this.state.documentState == DocumentState.Executed
            || this.state.documentState == DocumentState.Canceled
        return (
            <>
                <DialogTitle>
                    <Message messageKey={this.getLabelKey()}/>
                </DialogTitle>
                <div className={styles.dialogSubTitle}>
                    {this.getDocumentStateText()}
                </div>
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
                                    disabled={formDisabled}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<CounterAgent, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    label={<Message messageKey={"dialog.goods.document.field.agent.label"}/>}
                                    controller={this.props.controller}
                                    itemToString={agent => agent.name!}
                                    selectedItemProperty={"editedShipDocCounterAgent"}
                                    itemsProperty={"counterAgentsList"}
                                    disabled={formDisabled}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedShipDocNumber: "editedShipDocNumberField"}}
                                    label={<Message messageKey={"dialog.goods.document.field.series.label"}/>}
                                    disabled={formDisabled}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    fieldKey={{editedShipDocDate: "editedShipDocDateField"}}
                                    label={<Message messageKey={"dialog.goods.document.field.date.label"}/>}
                                    type={"date"}
                                    disabled={formDisabled}
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
                            <ConnectedMinorList<GoodsPackWithPrice, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                controller={this.props.controller}
                                itemsListProperty={"editedShipDocGoods"}
                                label={<Message messageKey={"dialog.goods.document.goodsList.label"}/>}
                                renderItem={item => this.renderGoodsListItem(item)}
                                onAddButtonClick={() => {
                                    if (this.state.type == ShipingType.Income) {
                                        this.props.controller.goodsDocumentActions.openCreateGoodsPackRightPanel()
                                    }
                                }}
                                addTooltipLabel={"dialog.goods.document.goodsList.add.label"}
                                disabled={formDisabled}
                                wrapAddButton={addButton => {
                                    return this.state.type == ShipingType.Income
                                        ? addButton
                                        : (<Selector<GoodsPack>
                                            items={this.state.stockGoodsForSelector}
                                            itemToString={pack => this.getPackNameForSelector(pack)}
                                            label={"Товары на складе"}
                                            disabled={false}
                                            onSelectButtonClick={items => this.props.controller.goodsDocumentActions.addDocPacksBySelection(items)}
                                        >
                                            {addButton}
                                        </Selector>)
                                }}
                            />
                        </div>
                    </div>
                    <DocumentDialogFooter
                        controller={this.props.controller}
                        submitDisabled={this.state.hasErrors}
                        showSaveButton={this.state.documentState == null || this.state.documentState == DocumentState.Saved}
                        showExecuteButton={this.state.documentState == DocumentState.Saved}
                        showCancelButton={this.state.documentState == DocumentState.Saved}
                        onSubmitClick={() => this.onSubmitButton()}
                        onExecuteClick={() => this.onExecuteButton()}
                        onCancelClick={() => this.props.controller.goodsDocumentActions.submitCancelDocument()}
                        onBackClick={() => this.props.controller.closeCurrentDialog()}
                    />
                </DialogContent>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            editedShipDocType: "type",
            editedShipDocFormHasErrors: "hasErrors",
            editedShipDocState: "documentState",
            editedShipDocNotAddedStockGoods: "stockGoodsForSelector",
        })
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    type: ShipingType | null,
    documentState: DocumentState | null,
    stockGoodsForSelector: GoodsPack[],
    hasErrors: boolean,
}