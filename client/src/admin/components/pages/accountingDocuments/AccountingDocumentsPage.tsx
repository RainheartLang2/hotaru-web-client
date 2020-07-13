import EmployeeAppController from "../../../controller/EmployeeAppController";
import * as React from "react";
import {ReactNode} from "react";
import GoodsDocument from "../../../../common/beans/GoodsDocument";
import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import {Link} from "@material-ui/core";
import Stock from "../../../../common/beans/Storage";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import {ShipingType} from "../../../../common/beans/enums/ShipingType";
import {DateUtils} from "../../../../core/utils/DateUtils";
import {DocumentState} from "../../../../common/beans/enums/DocumentState";

var styles = require("../../../commonStyles.css")

export default class AccountingDocumentsPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            documents: [],
            stocks: new Map(),
        }
    }

    private getDocumentTypeLabelKey(documentType: ShipingType): string {
        switch (documentType) {
            case (ShipingType.Income): return "common.accounting.document.income.label"
            case (ShipingType.Outcome): return "common.accounting.document.outcome.label"
            case (ShipingType.Inventory): return "common.accounting.document.inventory.label"
            case (ShipingType.Transfer): return "common.accounting.document.transfer.label"
            default: return "common.accounting.document.income.label"
        }
    }
    private renderDocumentName(document: GoodsDocument): ReactNode {
        return (<>
                <Message messageKey={this.getDocumentTypeLabelKey(document.shipingType)}/>
                {document.num && <Message messageKey={"page.accountingDocument.number.label"} args={[document.num]}/> }
            </>)
    }

    private getDocumentStateMessageKey(document: GoodsDocument): string {
        if (document.shipingType == ShipingType.Transfer) {
            switch (document.documentState) {
                case DocumentState.Saved: return "dialog.goods.document.saved.label"
                case DocumentState.Sent: return "dialog.goods.transfer.sent.label"
                case DocumentState.Executed: return "dialog.goods.transfer.accepted.label"
                case DocumentState.Canceled: return "dialog.goods.document.canceled.label"
                default: return "dialog.goods.document.saved.label"
            }
        } else {
            switch (document.documentState) {
                case DocumentState.Saved: return "dialog.goods.document.saved.label"
                case DocumentState.Executed: return "dialog.goods.document.executed.label"
                case DocumentState.Canceled: return "dialog.goods.document.canceled.label"
                default: return "dialog.goods.document.saved.label"
            }
        }
    }

    render() {
        return (<>
            <PageHeader label={(<Message messageKey={"page.accountingDocuments.title"}/>)}
                        hasButton={false}
                        buttonOnClick={() => {
                        }}/>
            <TableCmp>
                <TableBodyCmp>
                    {this.state.documents.map(document => {
                        const stock = this.state.stocks.get(document.stockId)
                        if (!stock) {
                            throw new Error("no stock for id " + document.stockId)
                        }
                        return (
                            <TableRowCmp key={document.id}>
                                <CustomTableCell>
                                    <Link
                                        color="primary"
                                        onClick={() => {
                                        }}
                                    >
                                        {this.renderDocumentName(document)}
                                    </Link>
                                </CustomTableCell>
                                <CustomTableCell>
                                    {stock.name}
                                </CustomTableCell>
                                <CustomTableCell>
                                    <Message messageKey={this.getDocumentStateMessageKey(document)}/>
                                </CustomTableCell>
                                <CustomTableCell>
                                    {document.date && DateUtils.standardFormatDate(document.date)}
                                </CustomTableCell>
                                <CustomTableCell style={styles.actionsCell}>
                                </CustomTableCell>
                            </TableRowCmp>
                        )
                    })}
                </TableBodyCmp>
            </TableCmp>
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            goodsDocuments: "documents",
            stocksById: "stocks",
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
    documents: GoodsDocument[]
    stocks: Map<number, Stock>
}