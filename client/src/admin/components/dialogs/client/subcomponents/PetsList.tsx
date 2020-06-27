import * as React from "react";
import {List, ListItem, ListItemText} from "@material-ui/core";
import {Pet} from "../../../../../common/beans/Pet";
import EmployeeAppController from "../../../../controller/EmployeeAppController";
import CustomContentButton from "../../../../../core/components/iconButton/CustomContentButton";
import AddIcon from '@material-ui/icons/AddSharp';
import {Message} from "../../../../../core/components/Message";
import CustomLink from "../../../../../core/components/customLink/CustomLink";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from '@material-ui/icons/DeleteSharp';
import Species from "../../../../../common/beans/Species";
import {NameUtils} from "../../../../../core/utils/NameUtils";

var styles = require("../styles.css")

export default class PetsList extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            pets: [],
            species: new Map(),
        }
    }

    private getListItemLabel(pet: Pet): string {
        const species = this.state.species.get(pet.speciesId!)
        return NameUtils.formatPetName(pet, species!)
    }

    render() {
        console.log(this.state.species)
        return (
            <div className={styles.petsList}>
                <div className={styles.petsListHeader}>
                    <div className={styles.petsListTitle}>
                        <Message messageKey={"dialog.client.petsList.title"}/>
                    </div>
                    <div className={styles.addPetButton}>
                        <CustomContentButton
                            onClick={() => this.props.controller.petActions.openAddPetForm()}
                            tooltipContent={<Message messageKey={"dialog.client.addPet.button.tooltip"}/>}
                        >
                            <AddIcon/>
                        </CustomContentButton>
                    </div>
                </div>
                <div className={styles.petsListContent}>
                    <List>
                        {this.state.pets.map(pet => {
                            return (
                                <ListItem className={styles.petItem}>
                                    <ListItemText primary={
                                        <CustomLink
                                            onClick={() => this.props.controller.petActions.openEditPetForm(pet)}
                                        >
                                            {this.getListItemLabel(pet)}
                                        </CustomLink>
                                    }/>
                                    <ListItemSecondaryAction>
                                        <CustomContentButton
                                            onClick={() => this.props.controller.petActions.deletePet(pet.id!)}
                                            tooltipContent={<Message messageKey={"dialog.client.petsList.delete.tooltip.label"}/>}
                                        >
                                            <DeleteIcon/>
                                        </CustomContentButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                </div>
            </div>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            petsForSelectedClient: "pets",
            speciesListById: "species",
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
    pets: Pet[]
    species: Map<number, Species>
}