import * as React from "react";
import {List, ListItem, ListItemText} from "@material-ui/core";
import {Pet} from "../../../../../common/beans/Pet";
import EmployeeAppController from "../../../../controller/EmployeeAppController";
import CustomContentButton from "../../../../../core/components/iconButton/CustomContentButton";
import AddIcon from '@material-ui/icons/AddSharp';
import {Message} from "../../../../../core/components/Message";
import CustomLink from "../../../../../core/components/customLink/CustomLink";

var styles = require("../styles.css")

export default class PetsList extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            pets: [],
        }
    }

    render() {
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
                        <ListItem className={styles.petItem}>
                            <ListItemText primary={<CustomLink onClick={() => {}}>Пример</CustomLink>}/>
                        </ListItem>
                        {this.state.pets.map(pet => {
                            return (
                                <ListItem className={styles.petItem}>
                                    <ListItemText primary={
                                        <CustomLink
                                            onClick={() => {}}
                                        >
                                            {pet.name}
                                        </CustomLink>
                                    }/>
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
            petsForSelectedClient: "pets"
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
}