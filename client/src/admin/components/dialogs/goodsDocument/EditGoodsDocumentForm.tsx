import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import {DialogContent, DialogTitle, ListItem, ListItemText} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import {ShipingType} from "../../../../common/beans/enums/ShipingType";
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import Stock from "../../../../common/beans/Storage";
import CounterAgent from "../../../../common/beans/CounterAgent";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import DialogFooter from "../../../../core/components/dialogFooter/DialogFooter";
import MinorList from "../../../../common/components/list/MinorList";
import GoodsPackWithPrice from "../../../../common/beans/GoodsPackWithPrice";
import {ReactNode} from "react";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CustomContentButton from "../../../../core/components/iconButton/CustomContentButton";
import DeleteIcon from '@material-ui/icons/DeleteSharp';
import EditIcon from '@material-ui/icons/EditSharp';

import {MathUtils} from "../../../../core/utils/MathUtils";

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
                            <MinorList<GoodsPackWithPrice, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                controller={this.props.controller}
                                itemsListProperty={"editedShipDocGoods"}
                                label={<Message messageKey={"dialog.goods.document.goodsList.label"}/>}
                                renderItem={item => this.renderGoodsListItem(item)}
                                onAddButtonClick={() => this.props.controller.goodsDocumentActions.openCreateGoodsPackRightPanel()}
                                addTooltipLabel={"dialog.goods.document.goodsList.add.label"}
                            />
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