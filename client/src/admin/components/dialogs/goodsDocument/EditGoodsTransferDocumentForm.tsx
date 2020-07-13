import * as React from "react";
import {ReactNode} from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {DocumentState} from "../../../../common/beans/enums/DocumentState";
import GoodsPack from "../../../../common/beans/GoodsPack";
import GoodsPackWithPrice from "../../../../common/beans/GoodsPackWithPrice";
import {DialogContent, DialogTitle, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import SalesUnit from "../../../../common/beans/SalesUnit";
import MeasureUnit from "../../../../common/beans/MeasureUnit";
import {Message} from "../../../../core/components/Message";
import {MathUtils} from "../../../../core/utils/MathUtils";
import {SalesUtils} from "../../../../core/utils/SalesUtils";
import DigitsOnlyValidator from "../../../../core/mvc/validators/DigitsOnlyValidator";
import MaximalLengthValidator from "../../../../core/mvc/validators/MaximalLengthValidator";
import MessageResource from "../../../../core/message/MessageResource";
import Stock from "../../../../common/beans/Storage";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../state/EmployeeApplicationStore";
import CustomContentButton from "../../../../core/components/iconButton/CustomContentButton";
import Selector from "../../../../core/components/selector/Selector";
import DocumentDialogFooter from "../../../../core/components/dialogFooter/DocumentDialogFooter";
import ValidatedTextField from "../../../../core/components/validatedTextField/ValidatedTextField";
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import ConnectedMinorList from "../../../../common/components/list/connected/ConnectedMinorList";
import DeleteIcon from '@material-ui/icons/DeleteSharp';

var styles = require("../../../commonStyles.css")
var specificStyles = require("./styles.css")


export default class EditGoodsTransferDocumentForm extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            hasErrors: false,
            documentState: null,
            stockGoodsForSelector: [],
        }
    }

    private renderGoodsPackName(item: GoodsPackWithPrice): ReactNode {
        const salesUnit = this.props.controller.salesUnitActions.getUnitById(item.goodsTypeId)
        const measureUnit = this.props.controller.dictionariesActions.getMeasureUnitById(salesUnit.measureUnitId)
        return (<>
            <ListItemText primary={salesUnit.name + " (" + measureUnit.name + ")"}
                          secondary={this.renderOutcomeGoodsPackSubName(item)}
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
        return (<>
            {this.renderGoodsPackName(item)}
            <ListItemSecondaryAction>
                <div className={styles.actions}>
                    <div className={specificStyles.amountArea}>
                        <div className={specificStyles.amountOnStock}>
                            <Message messageKey={"dialog.goods.document.goodsList.onStock"}
                                     args={[this.props.controller.stockActions.getCurrentStockGoodsPackAmount(item.id!).toString()]}
                            />
                        </div>
                        <div className={specificStyles.amountField}>
                            <ValidatedTextField
                                label={<Message messageKey={"dialog.goods.document.goodsList.inventory.editable"}/>}
                                validators={[new DigitsOnlyValidator(), new MaximalLengthValidator(15)]}
                                onValidBlur={event => {this.props.controller.goodsDocumentActions.setGoodsPackAmount(item, +event.target.value)}}
                                value={item.amount}
                                variant={"outlined"}
                            />
                        </div>
                    </div>
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
        this.props.controller.goodsDocumentActions.submitEditIncomeDocument(true)
    }

    private getDocumentStateText(): string {
        switch (this.state.documentState) {
            case null: return ""
            case DocumentState.Saved: return MessageResource.getMessage("dialog.goods.document.saved.label")
            case DocumentState.Sent: return MessageResource.getMessage("dialog.goods.transfer.sent.label")
            case DocumentState.Executed: return MessageResource.getMessage("dialog.goods.transfer.accepted.label")
            case DocumentState.Canceled: return MessageResource.getMessage("dialog.goods.document.canceled.label")
            default: throw new Error("unknown document state " + this.state.documentState)
        }
    }

    private showExecuteButton(sourceStockAccess: boolean, destinationStockAccess: boolean): boolean {
        return (this.state.documentState == DocumentState.Saved && sourceStockAccess)
            || (this.state.documentState == DocumentState.Sent && destinationStockAccess)
    }

    private getExecuteButtonLabel(): ReactNode {
        return (
            <Message messageKey={this.state.documentState == DocumentState.Saved
                                    ? "dialog.goods.transfer.send.button.label"
                                    : "dialog.goods.transfer.accept.button.label"}
            />
        )
    }


    render() {
        const formDisabled = this.state.documentState == DocumentState.Executed
            || this.state.documentState == DocumentState.Canceled
            || this.state.documentState == DocumentState.Sent
        const userHasAccessForSourceStock = true
        const userHasAccessForDestinationStock = true
        return (
            <>
                <DialogTitle>
                    <Message messageKey={"dialog.goods.document.transfer.label"}/>
                </DialogTitle>
                <div className={styles.dialogSubTitle}>
                    {this.getDocumentStateText()}
                </div>
                <DialogContent>
                    <div className={styles.dialogContent}>
                        <div className={styles.column}>
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<Stock, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    label={<Message messageKey={"dialog.goods.document.field.sourceStock.label"}/>}
                                    controller={this.props.controller}
                                    itemToString={stock => stock.name!}
                                    selectedItemProperty={"editedShipDocStock"}
                                    itemsProperty={"stocksList"}
                                    disabled={formDisabled}
                                    onChange={value => {
                                        this.props.controller.goodsDocumentActions.changeSourceStock(value)
                                    }}
                                />
                            </div>
                            <div className={styles.row}>
                                <ConnectedAutoCompleteField<Stock, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    label={<Message messageKey={"dialog.goods.document.field.destinationStock.label"}/>}
                                    controller={this.props.controller}
                                    itemToString={stock => stock.name!}
                                    selectedItemProperty={"editedShipDocDestinationStock"}
                                    itemsProperty={"stocksList"}
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
                                onAddButtonClick={() => {}}
                                addTooltipLabel={"dialog.goods.document.goodsList.add.label"}
                                disabled={formDisabled}
                                wrapAddButton={addButton => <Selector<GoodsPack>
                                            items={this.state.stockGoodsForSelector}
                                            itemToString={pack => this.getPackNameForSelector(pack)}
                                            label={"Товары на складе"}
                                            disabled={false}
                                            onSelectButtonClick={items => this.props.controller.goodsDocumentActions.addDocPacksBySelection(items)}
                                        >
                                            {addButton}
                                        </Selector>
                                }/>
                        </div>
                    </div>
                    <DocumentDialogFooter
                        controller={this.props.controller}
                        submitDisabled={this.state.hasErrors}
                        showSaveButton={this.state.documentState == null || this.state.documentState == DocumentState.Saved}
                        showExecuteButton={this.showExecuteButton(userHasAccessForSourceStock, userHasAccessForDestinationStock)}
                        executeButtonLabel={this.getExecuteButtonLabel()}
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
    documentState: DocumentState | null,
    stockGoodsForSelector: GoodsPack[],
    hasErrors: boolean,
}