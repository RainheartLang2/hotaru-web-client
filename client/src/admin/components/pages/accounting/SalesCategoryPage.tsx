import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../state/EmployeeApplicationStore";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import {SalesCategory} from "../../../../common/beans/SalesCategory";
import ValidatedTextField from "../../../../core/components/validatedTextField/ValidatedTextField";
import RequiredFieldValidator from "../../../../core/mvc/validators/RequiredFieldValidator";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import {SalesType} from "../../../../common/beans/enums/SalesType";
import DeleteIcon from "@material-ui/icons/DeleteSharp"
import AddIcon from "@material-ui/icons/AddSharp"
import CustomContentButton from "../../../../core/components/iconButton/CustomContentButton";
import {StringUtils} from "../../../../core/utils/StringUtils";
import {ValidatorUtils} from "../../../../core/utils/ValidatorUtils";
import MaximalLengthValidator from "../../../../core/mvc/validators/MaximalLengthValidator";

var styles = require("./styles.css")

export default class SalesCategoryPage extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            categoriesList: [],
        }
    }

    render() {
        const actions = this.props.controller.dictionariesActions
        return (<>
                <PageHeader
                    label={(<Message messageKey={"page.salesCategories.title"}/>)}
                    hasButton={false}
                    buttonOnClick={() => {
                    }}
                />
                <TableCmp>
                    <TableBodyCmp>
                        {this.state.categoriesList.map(item => {
                            return (<TableRowCmp key={item.id}>
                                    <CustomTableCell style={styles.nameCell}>
                                        <ValidatedTextField
                                            defaultValue={item.getName()}
                                            onFocus={() => actions.setSalesCategoryId(item.id)}
                                            onChange={(event) => {actions.setEditedSalesCategoryName(event.target.value)}}
                                            onBlur={(event) => actions.submitEditSalesCategory(() => actions.setSalesCategoryId(undefined))}
                                            validators={[
                                                new RequiredFieldValidator(),
                                                new MaximalLengthValidator(100),
                                            ]}
                                        />
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <ConnectedSelect<SalesType, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                            controller={this.props.controller}
                                            mapProperty={"salesTypesList"}
                                            selectedItemProperty={"editedSalesCategoryType"}
                                            itemToString={type => SalesType.salesTypeToString(type)}
                                            getKey={type => type ? SalesType.salesTypeToNumber(type) : -1}
                                            onFocus={() => actions.setSalesCategoryId(item.id)}
                                            onChange={event => actions.setEditedSalesCategoryType(event.target.value as SalesType)}
                                            onBlur={(event) => actions.submitEditSalesCategory(() => actions.setSalesCategoryId(undefined))}
                                            controlled={false}
                                            defaultValue={SalesType.Goods}
                                        />
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <ValidatedTextField
                                            defaultValue={StringUtils.numberToStringEmptyIfZero(item.getExtraCharge())}
                                            onFocus={() => actions.setSalesCategoryId(item.id)}
                                            onChange={(event) => {actions.setEditedSalesCategoryName(event.target.value)}}
                                            onBlur={(event) => actions.submitEditSalesCategory(() => actions.setSalesCategoryId(undefined))}
                                            validators={ValidatorUtils.getFloatNumberFieldValidators()}
                                        />
                                    </CustomTableCell>
                                    <CustomTableCell style={styles.actions}>
                                        <CustomContentButton
                                            onClick={() => {
                                                if (item.id) {
                                                    actions.deleteSalesCategory(item.id)
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
                        <TableRowCmp classes={{
                            root: styles.additionalRow
                        }}>
                            <CustomTableCell style={styles.nameCell}>
                                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    size={"small"}
                                    fieldKey={{addedSalesCategoryName: "addedSalesCategoryNameField"}}
                                    variant={"outlined"}
                                />
                            </CustomTableCell>
                            <CustomTableCell>
                                <ConnectedSelect<SalesType, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    mapProperty={"salesTypesList"}
                                    selectedItemProperty={"addedSalesCategoryType"}
                                    itemToString={type => SalesType.salesTypeToString(type)}
                                    getKey={type => type ? SalesType.salesTypeToNumber(type) : -1}
                                />
                            </CustomTableCell>
                            <CustomTableCell>
                                <ConnectedTextField
                                    controller={this.props.controller}
                                    fieldKey={{addedSalesCategoryExtraCharge: "addedSalesCategoryExtraChargeField"}}
                                    variant={"outlined"}
                                />
                            </CustomTableCell>
                            <CustomTableCell style={""}>
                                <CustomContentButton
                                    onClick={() => actions.submitCreateSalesCategory()}
                                    tooltipContent={<Message messageKey={"common.button.create"}/>}
                                >
                                    <AddIcon/>
                                </CustomContentButton>
                            </CustomTableCell>
                        </TableRowCmp>
                    </TableBodyCmp>
                </TableCmp>
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            salesCategoriesList: "categoriesList",
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
    categoriesList: SalesCategory[]
}