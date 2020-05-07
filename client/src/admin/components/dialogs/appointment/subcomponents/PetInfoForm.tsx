import * as React from "react";
import ConnectedTextField from "../../../../../core/components/conntectedTextField/ConnectedTextField";
import AdminAppController from "../../../../controller/AdminAppController";
import {AdminStateProperty} from "../../../../state/AdminApplicationState";
import ConnectedSelect from "../../../../../core/components/ConnectedSelect/ConnectedSelect";
import Species from "../../../../../common/beans/Species";
import {Message} from "../../../../../core/components/Message";
import Breed from "../../../../../common/beans/Breed";

const styles = require("../styles.css");

export default class PetInfoForm extends React.Component<Properties> {
    render() {
        return (<>
            <div className={styles.row}>
                <div className={styles.petNameField}>
                    <ConnectedTextField
                        controller={this.props.controller}
                        label={<Message messageKey={"dialog.appointment.field.petName.label"}/>}
                        fieldPropertyName={AdminStateProperty.EditedClientPetName}
                    />
                </div>
                <div className={styles.petSpeciesSelect}>
                    <ConnectedSelect<Species>
                        controller={this.props.controller}
                        mapProperty={AdminStateProperty.EditedClientPetSpecies}
                        selectedItemProperty={AdminStateProperty.EditedClientSelectedSpecies}
                        itemToString={species => species.name ? species.name : ""}
                        getKey={species => species && species.id ? species.id : 0}
                    />
                </div>
                <div className={styles.petBreedSelect}>
                    <ConnectedSelect<Breed>
                        controller={this.props.controller}
                        mapProperty={AdminStateProperty.EditedClientPetBreeds}
                        selectedItemProperty={AdminStateProperty.EditedClientSelectedBreed}
                        itemToString={breed => breed.name ? breed.name : ""}
                        getKey={breed => breed && breed.id ? breed.id : 0}
                    />
                </div>
            </div>
        </>)
    }
}

type Properties = {
    controller: AdminAppController
}