import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import {Link, TextField} from "@material-ui/core";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import Diagnosis from "../../../../common/beans/Diagnosis";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";

var styles = require("./styles.css")

export default class DiagnosisPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            diagnosisList: [],
        }
    }

    render() {
        const actions = this.props.controller.dictionariesActions
        return (
            <>
                <PageHeader
                    label={(<Message messageKey={"page.diagnosis.title"}/>)}
                    hasButton={false}
                    buttonOnClick={() => {
                    }}
                />
                <TableCmp>
                    <TableBodyCmp>
                        {this.state.diagnosisList.map(item => {
                            return (<TableRowCmp key={item.id}>
                                    <CustomTableCell style={styles.nameCell}>
                                        <TextField
                                            variant={"outlined"}
                                            size={"small"}
                                            defaultValue={item.name}
                                            onFocus={() => actions.setEditedDiagnosisId(item.id)}
                                            onChange={(event) => actions.setEditedDiagnosisName(event.target.value)}
                                            onBlur={(event) => actions.submitEditDiagnosis(() => actions.setEditedDiagnosisId(undefined))}
                                        />
                                    </CustomTableCell>
                                    <CustomTableCell style={styles.actions}>
                                        <Link
                                            color="primary"
                                            onClick={() => {
                                                if (item.id) {
                                                    actions.deleteDiagnosis(item.id)
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
                                    fieldKey={{addedDiagnosisName: "addedDiagnosisNameField"}}
                                    variant={"outlined"}
                                />
                            </CustomTableCell>
                            <CustomTableCell style={""}>
                                <Link
                                    color="primary"
                                    onClick={() => actions.submitCreateDiagnosis()}
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
            diagnosisList: "diagnosisList"
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
    diagnosisList: Diagnosis[]
}
