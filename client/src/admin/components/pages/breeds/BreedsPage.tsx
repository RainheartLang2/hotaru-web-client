import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import Species from "../../../../common/beans/Species";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import {Link, TextField} from "@material-ui/core";
import Breed from "../../../../common/beans/Breed";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../state/EmployeeApplicationStore";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";

var styles = require("./styles.css")

export default class BreedsPage extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)

        this.state = {
            breedsList: []
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
                    <ConnectedSelect<Species, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        variant={"outlined"}
                        controller={this.props.controller}
                        mapProperty={"speciesListById"}
                        selectedItemProperty={"breedPageSelectedSpecies"}
                        itemToString={(species: Species | null) => species && species.name ? species.name : ""}
                        getKey={species => species && species.id ? species.id : 0}
                    />
                </div>
            </div>
            <TableCmp>
                <TableBodyCmp>
                    {this.state.breedsList.map(item => {
                        return (<TableRowCmp key={item.id}>
                                <CustomTableCell style={styles.nameCell}>
                                    <TextField
                                        variant={"outlined"}
                                        size={"small"}
                                        defaultValue={item.name}
                                        onFocus={() => this.props.controller.setState({editedBreedId: item.id})}
                                        onChange={(event) => this.props.controller.setState({editedBreedName: event.target.value})}
                                        onBlur={(event) => actions.submitEditItem(() => this.props.controller.setState({editedBreedId: undefined}))}
                                    />
                                </CustomTableCell>
                                <CustomTableCell style={""}>
                                    <Link
                                        color="primary"
                                        onClick={() => {
                                            if (item.id) {
                                                actions.deleteBreed(item.id)
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
                                fieldKey={{addedBreedName: "addedBreedNameField"}}
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
        this.props.controller.subscribe(this, {
            breedsForCurrentSpecies: "breedsList",
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
    breedsList: Breed[],
}