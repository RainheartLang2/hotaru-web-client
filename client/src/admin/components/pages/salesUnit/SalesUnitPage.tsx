import EmployeeAppController from "../../../controller/EmployeeAppController";
import * as React from "react";
import SalesUnit from "../../../../common/beans/SalesUnit";
import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../../core/components";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import {SalesType} from "../../../../common/beans/enums/SalesType";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import CustomContentButton from "../../../../core/components/iconButton/CustomContentButton";
import {SalesCategory} from "../../../../common/beans/SalesCategory";
import DeleteIcon from "@material-ui/icons/DeleteSharp"
import AddIcon from "@material-ui/icons/AddSharp"
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import MeasureUnit from "../../../../common/beans/MeasureUnit";

var styles = require("./styles.css")

export default class SalesUnitPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            salesUnits: [],
            addedRowHasErrors: false,
        }
    }

    render() {
        const actions = this.props.controller.salesUnitActions
        return (<>
            <PageHeader label={(<Message messageKey={"page.salesUnit.title"}/>)}
                        hasButton={false}
                        buttonOnClick={() => {}}/>
            <TableCmp>
                <TableBodyCmp>
                    {this.state.salesUnits.map(unit => {
                        return (
                            <>
                                <CustomTableCell>
                                    {unit.getName()}
                                </CustomTableCell>
                                <CustomTableCell/>
                                <CustomTableCell/>
                                <CustomTableCell/>
                                <CustomTableCell>
                                    <CustomContentButton
                                        onClick={() => {
                                            if (unit.id) {
                                                actions.delete(unit.id)
                                            }
                                        }}
                                        tooltipContent={<Message messageKey={"common.button.delete"}/>}
                                    >
                                        <DeleteIcon/>
                                    </CustomContentButton>
                                </CustomTableCell>
                            </>
                        )
                    })}
                </TableBodyCmp>
            </TableCmp>
            <TableRowCmp classes={{
                root: styles.additionalRow
            }}>
                <CustomTableCell style={styles.nameCell}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        size={"small"}
                        fieldKey={{addedSalesUnitName: "addedSalesUnitNameField"}}
                        variant={"outlined"}
                    />
                </CustomTableCell>
                <CustomTableCell>
                    <ConnectedSelect<SalesType, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        mapProperty={"salesTypesList"}
                        selectedItemProperty={"addedSalesUnitType"}
                        itemToString={type => SalesType.salesTypeToString(type)}
                        getKey={type => type ? SalesType.salesTypeToNumber(type) : -1}
                    />
                </CustomTableCell>
                <CustomTableCell>
                    <ConnectedAutoCompleteField <SalesCategory, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        itemToString={category => category ? category.getName() : ""}
                        selectedItemProperty={"addedSalesUnitCategory"}
                        itemsProperty={"salesCategoriesForSelectedType"}
                        variant={"outlined"}
                    />
                </CustomTableCell>
                <CustomTableCell>
                    <ConnectedAutoCompleteField <MeasureUnit, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        itemToString={measure => measure ? measure.name! : ""}
                        selectedItemProperty={"addedSalesUnitMeasureUnit"}
                        itemsProperty={"measureList"}
                        variant={"outlined"}
                    />
                </CustomTableCell>
                <CustomTableCell>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{addedSalesUnitPrice: "addedSalesUnitPriceField"}}
                        variant={"outlined"}
                    />
                </CustomTableCell>
                <CustomTableCell style={""}>
                    <CustomContentButton
                        onClick={() => {this.props.controller.salesUnitActions.submitCreateSalesUnit()}}
                        tooltipContent={<Message messageKey={"common.button.create"}/>}
                        disabled={this.state.addedRowHasErrors}
                    >
                        <AddIcon/>
                    </CustomContentButton>
                </CustomTableCell>
            </TableRowCmp>
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            salesUnitList: "salesUnits",
            addedSalesUnitFieldsHasError: "addedRowHasErrors",
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
    salesUnits: SalesUnit[],
    addedRowHasErrors: boolean,
}