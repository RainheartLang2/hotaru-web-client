import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {AdminStateProperty} from "../../../state/AdminApplicationState";
import AdminAppController from "../../../controller/AdminAppController";
import Species from "../../../../common/beans/Species";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import {Link, TextField} from "@material-ui/core";
import Breed from "../../../../common/beans/Breed";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";

var styles = require("./styles.css")

export default class BreedsPage extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)

        this.state = {
            [StateProperty.BreedsList]: []
        }
    }

    render() {
        const actions = this.props.controller.breedActions
        return (<>
            <PageHeader
                label={(<Message messageKey={"page.breeds.title"}/>)}
                hasButton={false}
            />
            <div className={styles.selectorWrapper}>
                <div className={styles.selectorTitle}>
                    <Message messageKey={"page.breeds.speciesSelector.title"}/>
                </div>
                <div className={styles.selector}>
                    <ConnectedSelect<Species>
                        variant={"outlined"}
                        controller={this.props.controller}
                        mapProperty={AdminStateProperty.SpeciesListById}
                        selectedItemProperty={AdminStateProperty.BreedPageSelectedSpecies}
                        itemToString={(species: Species | null) => species && species.name ? species.name : ""}
                        getKey={species => species && species.id ? species.id : 0}
                    />
                </div>
            </div>
            <TableCmp>
                <TableBodyCmp>
                    {this.state[StateProperty.BreedsList].map(item => {
                        return (<TableRowCmp key={item.id}>
                                <CustomTableCell style={styles.nameCell}>
                                    <TextField
                                        variant={"outlined"}
                                        size={"small"}
                                        defaultValue={item.name}
                                        onFocus={() => actions.setEditedBreedId(item.id)}
                                        onChange={(event) => actions.setEditedBreedName(event.target.value)}
                                        onBlur={(event) => actions.submitEditItem(() => actions.setEditedBreedId(undefined))}
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
                    <TableRowCmp classes={{
                        root: styles.additionalRow
                    }}>
                        <CustomTableCell style={styles.nameCell}>
                            <ConnectedTextField
                                controller={this.props.controller}
                                size={"small"}
                                fieldPropertyName={AdminStateProperty.AddedBreedName}
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
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.BreedsForCurrentSpecies, this, StateProperty.BreedsList)
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

enum StateProperty {
    BreedsList = "breedsList"
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.BreedsList]: Breed[],
}