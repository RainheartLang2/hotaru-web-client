import * as React from "react";
import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import {Link} from "@material-ui/core";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import GoodsProducer from "../../../../common/beans/GoodsProducer";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import ValidatedTextField from "../../../../core/components/validatedTextField/ValidatedTextField";
import {ValidatorUtils} from "../../../../core/utils/ValidatorUtils";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";

var styles = require("../../../commonStyles.css")

export default class GoodsProducersPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            producers: [],
        }
    }

    render() {
        const actions = this.props.controller.dictionariesActions
        return (
            <>
                <PageHeader
                    label={(<Message messageKey={"page.goodsProducer.title"}/>)}
                    hasButton={false}
                    buttonOnClick={() => {
                    }}
                />
                <TableCmp>
                    <TableBodyCmp>
                        {this.state.producers.map(item => {
                            return (<TableRowCmp key={item.id}>
                                    <CustomTableCell style={styles.nameCell}>
                                        <ValidatedTextField
                                            validators={ValidatorUtils.getStandardTextValidators(100)}
                                            onValidBlur={(event) => actions.submitEditGoodsProducer(item.id!, event.target.value)}
                                            defaultValue={item.name}
                                        />
                                    </CustomTableCell>
                                    <CustomTableCell style={styles.actions}>
                                        <Link
                                            color="primary"
                                            onClick={() => {
                                                if (item.id) {
                                                    actions.deleteGoodsProducer(item.id)
                                                }
                                            }}
                                        >
                                            <Message messageKey={"common.button.delete"}/>
                                        </Link>
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
                                    fieldKey={{addedGoodsProducerName: "addedGoodsProducerNameField"}}
                                    variant={"outlined"}
                                />
                            </CustomTableCell>
                            <CustomTableCell style={""}>
                                <Link
                                    color="primary"
                                    onClick={() => actions.submitCreateGoodsProducer()}
                                >
                                    <Message messageKey={"common.button.create"}/>
                                </Link>
                            </CustomTableCell>
                        </TableRowCmp>
                    </TableBodyCmp>
                </TableCmp>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            goodsProducersList: "producers",
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
    producers: GoodsProducer[],
}
