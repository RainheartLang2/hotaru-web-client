import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import Stock from "../../../../common/beans/Storage";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import {Link} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteSharp"
import CustomContentButton from "../../../../core/components/iconButton/CustomContentButton";
import {StockType} from "../../../../common/beans/enums/StockType";
import {NameUtils} from "../../../../core/utils/NameUtils";

export default class StocksPage extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            stocks: [],
        }
    }

    render() {
        const actions = this.props.controller.stockActions
        return (
            <>
                <PageHeader label={(<Message messageKey={"page.stocks.title"}/>)}
                            hasButton={true}
                            buttonOnClick={() => actions.openCreateDialog()}/>
                <TableCmp>
                    <TableBodyCmp>
                        {this.state.stocks.map(stock => {
                            const employee = this.props.controller.employeeActions.getEmployeeById(stock.responsiblePersonId)
                            return (
                                <TableRowCmp key={stock.id}>
                                    <CustomTableCell>
                                        <Link
                                            color="primary"
                                            onClick={() => actions.openEditDialog(stock)}
                                        >
                                            {stock.name}
                                        </Link>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {StockType.stockTypeToString(stock.stockType)}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {this.props.controller.clinicActions.getClinicById(stock.clinicId).name}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {NameUtils.formatName(employee)}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <CustomContentButton
                                            onClick={() => {
                                                if (stock.id) {
                                                    actions.delete(stock.id)
                                                }
                                            }}
                                            tooltipContent={<Message messageKey={"common.button.delete"}/>}
                                        >
                                            <DeleteIcon/>
                                        </CustomContentButton>
                                    </CustomTableCell>
                                </TableRowCmp>
                            )
                        })}
                    </TableBodyCmp>
                </TableCmp>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            stocksList: "stocks",
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
    stocks: Stock[],
}