import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import {TextField} from "@material-ui/core";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import * as React from "react";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import Link from "@material-ui/core/Link";
import ActionSeparator from "../../../../common/components/actionSeparator/ActionSeparator";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import Measure from "../../../../common/beans/Measure";

var styles = require("./styles.css")

export default class MeasurePage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            measureList: [],
        }
    }

    render() {
        const actions = this.props.controller.measureActions
        return (
            <>
                <PageHeader
                    label={(<Message messageKey={"page.measure.title"}/>)}
                    hasButton={false}
                    buttonOnClick={() => {
                    }}
                />
                <TableCmp>
                    <TableBodyCmp>
                        {this.state.measureList.map(item => {
                            return (<TableRowCmp key={item.id}>
                                    <CustomTableCell style={styles.nameCell}>
                                        <TextField
                                            variant={"outlined"}
                                            size={"small"}
                                            defaultValue={item.name}
                                            onFocus={() => actions.setEditedMeasureId(item.id)}
                                            onChange={(event) => actions.setEditedMeasureName(event.target.value)}
                                            onBlur={(event) => actions.submitEditItem(() => actions.setEditedMeasureId(undefined))}
                                        />
                                    </CustomTableCell>
                                    <CustomTableCell style={styles.actions}>
                                        <Link
                                            color="primary"
                                            onClick={() => {
                                                if (item.id) {
                                                    actions.deleteMeasure(item.id)
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
                                    fieldKey={{addedMeasureName: "addedMeasureNameField"}}
                                    variant={"outlined"}
                                />
                            </CustomTableCell>
                            <CustomTableCell style={""}>
                                <Link
                                    color="primary"
                                    onClick={() => actions.submitCreateItem()}
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
            measureList: "measureList"
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
    measureList: Measure[]
}
