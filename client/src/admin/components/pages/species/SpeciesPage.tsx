import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import * as React from "react";
import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import AdminAppController from "../../../controller/AdminAppController";
import {AdminStateProperty} from "../../../state/AdminApplicationState";
import Species from "../../../../common/beans/Species";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import {TextField} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import ActionSeparator from "../../../../common/components/actionSeparator/ActionSeparator";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import TypedConnectedTextField from "../../../../core/components/conntectedTextField/TypedConnectedTextField";

var styles = require("./styles.css")

export default class SpeciesPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            speciesList: [],
        }
    }

    render() {
        const actions = this.props.controller.speciesActions
        return (
            <>
                <PageHeader
                    label={(<Message messageKey={"page.species.title"}/>)}
                    hasButton={false}
                    buttonOnClick={() => {
                    }}
                />
                <TableCmp>
                    <TableBodyCmp>
                        {this.state.speciesList.map(item => {
                            return (<TableRowCmp key={item.id}>
                                    <CustomTableCell style={styles.nameCell}>
                                        <TextField
                                            variant={"outlined"}
                                            size={"small"}
                                            defaultValue={item.name}
                                            onFocus={() => actions.setEditedSpeciesId(item.id)}
                                            onChange={(event) => actions.setEditedSpeciesName(event.target.value)}
                                            onBlur={(event) => actions.submitEditItem(() => actions.setEditedSpeciesId(undefined))}
                                        />
                                    </CustomTableCell>
                                    <CustomTableCell style={styles.actions}>
                                        <Link
                                            color={"primary"}
                                            onClick={() => this.props.controller.openBreedsPage(item.id)}
                                        >
                                            <Message messageKey={"page.species.button.toBreeds.label"}/>
                                        </Link>
                                        <ActionSeparator/>
                                        <Link
                                            color="primary"
                                            onClick={() => {
                                                if (item.id) {
                                                    actions.deleteSpecies(item.id)
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
                                <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                                    controller={this.props.controller}
                                    size={"small"}
                                    fieldKey={{addedSpeciesName: "addedSpeciesNameField"}}
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
            speciesList: "speciesList"
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
    speciesList: Species[]
}
