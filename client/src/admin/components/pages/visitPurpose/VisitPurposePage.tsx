import * as React from "react";
import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import {Link, TextField} from "@material-ui/core";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import VisitPurpose from "../../../../common/beans/VisitPurpose";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";

var styles = require("./styles.css")

export default class VisitPurposePage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            visitPurposesList: [],
        }
    }

    render() {
        const actions = this.props.controller.dictionariesActions
        return (
            <>
                <PageHeader
                    label={(<Message messageKey={"page.visitPurpose.title"}/>)}
                    hasButton={false}
                    buttonOnClick={() => {
                    }}
                />
                <TableCmp>
                    <TableBodyCmp>
                        {this.state.visitPurposesList.map(item => {
                            return (<TableRowCmp key={item.id}>
                                    <CustomTableCell style={styles.nameCell}>
                                        <TextField
                                            variant={"outlined"}
                                            size={"small"}
                                            defaultValue={item.name}
                                            onFocus={() => actions.setEditedVisitPurposeId(item.id)}
                                            onChange={(event) => actions.setEditedVisitPurposeName(event.target.value)}
                                            onBlur={(event) => actions.submitEditVisitPurpose(() => actions.setEditedVisitPurposeId(undefined))}
                                        />
                                    </CustomTableCell>
                                    <CustomTableCell style={styles.actions}>
                                        <Link
                                            color="primary"
                                            onClick={() => {
                                                if (item.id) {
                                                    actions.deleteVisitPurpose(item.id)
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
                                    fieldKey={{addedVisitPurposeName: "addedVisitPurposeNameField"}}
                                    variant={"outlined"}
                                />
                            </CustomTableCell>
                            <CustomTableCell style={""}>
                                <Link
                                    color="primary"
                                    onClick={() => actions.submitCreateVisitPurpose()}
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
            visitPurposesList: "visitPurposesList"
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
    visitPurposesList: VisitPurpose[]
}
