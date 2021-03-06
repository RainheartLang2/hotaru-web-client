import EmployeeAppController from "../../../controller/EmployeeAppController";
import * as React from "react";
import SalesUnit from "../../../../common/beans/SalesUnit";
import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../state/EmployeeApplicationStore";
import {SalesType} from "../../../../common/beans/enums/SalesType";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import CustomContentButton from "../../../../core/components/iconButton/CustomContentButton";
import {SalesCategory} from "../../../../common/beans/SalesCategory";
import DeleteIcon from "@material-ui/icons/DeleteSharp"
import AddIcon from "@material-ui/icons/AddSharp"
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import MeasureUnit from "../../../../common/beans/MeasureUnit";
import ValidatedTextField from "../../../../core/components/validatedTextField/ValidatedTextField";
import {ValidatorUtils} from "../../../../core/utils/ValidatorUtils";
import SimpleAutoCompleteField from "../../../../core/simpleAutoComplete/SimpleAutoCompleteField";

var styles = require("./styles.css")

export default class SalesUnitPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            salesUnits: [],
            addedRowHasErrors: false,
            serviceCategories: [],
            goodsCategories: [],
            measureUnits: [],
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
                            <TableRowCmp>
                                <CustomTableCell>
                                    <ValidatedTextField
                                        validators={ValidatorUtils.getStandardTextValidators(100)}
                                        onValidBlur={(event) => actions.setSalesName(unit.id!, event.target.value)}
                                        defaultValue={unit.getName()}
                                    />
                                </CustomTableCell>
                                <CustomTableCell>
                                    <ConnectedSelect<SalesType, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                        controller={this.props.controller}
                                        mapProperty={"salesTypesList"}
                                        itemToString={type => SalesType.salesTypeToString(type)}
                                        getKey={type => type ? SalesType.salesTypeToNumber(type) : -1}
                                        onChange={event => actions.setSalesType(unit.id!, event.target.value as SalesType)}
                                        controlled={false}
                                        defaultValue={unit.getSalesType()}
                                    />
                                </CustomTableCell>
                                <CustomTableCell>
                                    <SimpleAutoCompleteField<SalesCategory>
                                        itemToString={category => category ? category.getName() : ""}
                                        variant={"outlined"}
                                        items={unit.getSalesType() == SalesType.Goods ? this.state.goodsCategories : this.state.serviceCategories}
                                        defaultValue={this.props.controller.dictionariesActions.getSalesCategoryById(unit.categoryId)}
                                        onChange={value => {
                                            if (value) {
                                                actions.setSalesCategory(unit.id!, value)
                                            }
                                        }}
                                    />
                                </CustomTableCell>
                                <CustomTableCell>
                                    <SimpleAutoCompleteField<MeasureUnit>
                                        itemToString={unit => unit ? unit.name! : ""}
                                        variant={"outlined"}
                                        items={this.state.measureUnits}
                                        defaultValue={this.props.controller.dictionariesActions.getMeasureUnitById(unit.measureUnitId)}
                                        onChange={value => {
                                            if (value) {
                                                actions.setMeasureUnit(unit.id!, value)
                                            }
                                        }}
                                    />
                                </CustomTableCell>
                                <CustomTableCell>
                                    <ValidatedTextField
                                        validators={ValidatorUtils.getPriceValidators()}
                                        onValidBlur={event => {
                                            actions.setPrice(unit.id!, +event.target.value)
                                        }}
                                        defaultValue={unit.price}
                                    />
                                </CustomTableCell>
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
                            </TableRowCmp>
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
            goodsSalesCategories: "goodsCategories",
            serviceSalesCategories: "serviceCategories",
            measureList: "measureUnits",
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
    measureUnits: MeasureUnit[],
    goodsCategories: SalesCategory[],
    serviceCategories: SalesCategory[],
    addedRowHasErrors: boolean,
}