import * as React from "react";
import EmployeeAppController from "../../../../controller/EmployeeAppController";
import LeftMenu, {LeftMenuEntry} from "../../../../../core/components/leftMenu/LeftMenu";
import {Message} from "../../../../../core/components/Message";
import {AccountingMenuItemType} from "../../../../state/enum/AccountingMenuItemType";

export default class AccountingLeftMenu extends React.Component<Properties, State> {
    private entries: LeftMenuEntry[]

    constructor(props: Properties) {
        super(props)
        this.entries = [
            {
                key: AccountingMenuItemType.Sales,
                label: <Message messageKey={"second.navigation.accounting.sales.label"}/>,
                onClick: () => this.props.controller.openSalesPage(),
            },
            {
                key: AccountingMenuItemType.SalesCategories,
                label: <Message messageKey={"second.navigation.accounting.categories.label"}/>,
                onClick: () => this.props.controller.openSalesCategoryPage()
            },
            {
                key: AccountingMenuItemType.Stocks,
                label: <Message messageKey={"second.navigation.accounting.stocks.label"}/>,
                onClick: () => this.props.controller.openStocksPage()
            }
        ]
    }

    render() {
        return (
            <LeftMenu entries={this.entries} selectedEntryKey={this.props.selectedEntryKey}/>
        )
    }
}

type Properties = {
    controller: EmployeeAppController
    selectedEntryKey: number | null
}

type State = {}
