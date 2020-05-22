import * as React from "react";
import {AdminStateProperty} from "../../../../state/AdminApplicationState";
import Species from "../../../../../common/beans/Species";
import {Message} from "../../../../../core/components/Message";
import Breed from "../../../../../common/beans/Breed";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../../state/EmployeeApplicationStore";
import TypedConnectedTextField from "../../../../../core/components/conntectedTextField/TypedConnectedTextField";
import EmployeeAppController from "../../../../controller/EmployeeAppController";
import TypedConnectedSelect from "../../../../../core/components/ConnectedSelect/TypedConnectedSelect";

const styles = require("../styles.css");

export default class PetInfoForm extends React.Component<Properties> {
    render() {
        return (<>
            <div className={styles.row}>
                <div className={styles.petNameField}>
                    <TypedConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        label={<Message messageKey={"dialog.appointment.field.petName.label"}/>}
                        fieldKey={{editedClientPetName: "editedClientPetNameField"}}
                    />
                </div>
                <div className={styles.petSpeciesSelect}>
                    <TypedConnectedSelect<Species, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        mapProperty={AdminStateProperty.EditedClientPetSpecies}
                        selectedItemProperty={AdminStateProperty.EditedClientSelectedSpecies}
                        itemToString={species => species.name ? species.name : ""}
                        getKey={species => species && species.id ? species.id : 0}
                    />
                </div>
                <div className={styles.petBreedSelect}>
                    <TypedConnectedSelect<Breed, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
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
    controller: EmployeeAppController
}