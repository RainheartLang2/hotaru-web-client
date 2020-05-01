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

var styles = require("./styles.css")

export default class SpeciesPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            [StateProperty.SpeciesList]: [],
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
                        {this.state[StateProperty.SpeciesList].map(item => {
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
                                    <CustomTableCell style={""}>
                                        <Link
                                            color="primary"
                                            onClick={() => {
                                                if (item.id) {
                                                    actions.deleteItem(item.id)
                                                }
                                            }}
                                        >
                                            <Message messageKey={"common.button.delete"}/>
                                        </Link>
                                    </CustomTableCell>
                                </TableRowCmp>
                            )
                        })}
                        <TableRowCmp>
                            <CustomTableCell style={styles.nameCell}>
                                <ConnectedTextField
                                    controller={this.props.controller}
                                    size={"small"}
                                    fieldPropertyName={AdminStateProperty.AddedSpeciesName}
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
        this.props.controller.subscribe(AdminStateProperty.SpeciesList, this, StateProperty.SpeciesList)
    }
}

enum StateProperty {
    SpeciesList = "speciesList"
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.SpeciesList]: Species[]
}
