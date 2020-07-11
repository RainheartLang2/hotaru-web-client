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

var styles = require("../../../commonStyles.css")

export default class EditGoodsDocumentForm extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            hasErrors: false,
            type: null,
            documentState: null,
        }
    }

    private renderGoodsPackName(item: GoodsPackWithPrice): ReactNode {
        const salesUnit = this.props.controller.salesUnitActions.getUnitById(item.goodsTypeId)
        const measureUnit = this.props.controller.dictionariesActions.getMeasureUnitById(salesUnit.measureUnitId)
        return (<Message messageKey={"dialog.goods.document.goodsList.name.template"}
                         args={[salesUnit.name,
                                item.amount.toString(),
                                measureUnit.name!,
                                item.price.toString(),
                                MathUtils.calculateCost(item.amount, item.price, item.taxRate).toString()
                                ]}/>)
    }

    private renderGoodsListItem(item: GoodsPackWithPrice): ReactNode {
        return (<>
            <ListItemText primary={this.renderGoodsPackName(item)}/>
            <ListItemSecondaryAction>
                <div className={styles.actions}>
                    <CustomContentButton
                        onClick={() => this.props.controller.goodsDocumentActions.openEditGoodsPackRightPanel(item)}
                        tooltipContent={<Message messageKey={"common.button.edit"}/>}
                    >
                        <EditIcon/>
                    </CustomContentButton>
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

    render() {
        const formDisabled = this.state.documentState == DocumentState.Executed
            || this.state.documentState == DocumentState.Canceled
        return (
            <>
                <DialogTitle>
                    <Message messageKey={"dialog.goods.document.income.label"}/>
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
                                onAddButtonClick={() => this.props.controller.goodsDocumentActions.openCreateGoodsPackRightPanel()}
                                addTooltipLabel={"dialog.goods.document.goodsList.add.label"}
                                disabled={formDisabled}
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
        })
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    type: ShipingType | null,
    documentState: DocumentState | null,
    hasErrors: boolean
}