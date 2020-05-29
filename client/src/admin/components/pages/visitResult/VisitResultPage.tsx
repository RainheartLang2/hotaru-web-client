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
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import MeasureUnit from "../../../../common/beans/MeasureUnit";
import VisitResult from "../../../../common/beans/VisitResult";

var styles = require("./styles.css")

export default class VisitResultPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            list: [],
        }
    }

    private setEditVisitResultId(id: number | undefined) {
        this.props.controller.setState({editedVisitResultId: id})
    }

    render() {
        const actions = this.props.controller.dictionariesActions
        return (
            <>
                <PageHeader
                    label={(<Message messageKey={"page.visitResult.title"}/>)}
                    hasButton={false}
                    buttonOnClick={() => {
                    }}
                />
                <TableCmp>
                    <TableBodyCmp>
                        {this.state.list.map(item => {
                            return (<TableRowCmp key={item.id}>
                                    <CustomTableCell style={styles.nameCell}>
                                        <TextField
                                            variant={"outlined"}
                                            size={"small"}
                                            defaultValue={item.name}
                                            onFocus={() => this.setEditVisitResultId(item.id)}
                                            onChange={(event) => this.props.controller.setState({editedVisitResultName: event.target.value})}
                                            onBlur={(event) => actions.submitEditVisitResult(() => this.setEditVisitResultId(undefined))}
                                        />
                                    </CustomTableCell>
                                    <CustomTableCell style={styles.actions}>
                                        <Link
                                            color="primary"
                                            onClick={() => {
                                                if (item.id) {
                                                    actions.deleteVisitResult(item.id)
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
                                    fieldKey={{addedVisitResultName: "addedVisitResultNameField"}}
                                    variant={"outlined"}
                                />
                            </CustomTableCell>
                            <CustomTableCell style={""}>
                                <Link
                                    color="primary"
                                    onClick={() => actions.submitCreateVisitResult()}
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
            visitResultsList: "list",
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
    list: VisitResult[]
}
