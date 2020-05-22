import * as React from "react";
import Species from "../../../../../common/beans/Species";
import {Message} from "../../../../../core/components/Message";
import Breed from "../../../../../common/beans/Breed";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../../state/EmployeeApplicationStore";
import ConnectedTextField from "../../../../../core/components/conntectedTextField/ConnectedTextField";
import EmployeeAppController from "../../../../controller/EmployeeAppController";
import ConnectedSelect from "../../../../../core/components/ConnectedSelect/ConnectedSelect";

const styles = require("../styles.css");

export default class PetInfoForm extends React.Component<Properties> {
    render() {
        return (<>
            <div className={styles.row}>
                <div className={styles.petNameField}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        label={<Message messageKey={"dialog.appointment.field.petName.label"}/>}
                        fieldKey={{editedClientPetName: "editedClientPetNameField"}}
                    />
                </div>
                <div className={styles.petSpeciesSelect}>
                    <ConnectedSelect<Species, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        mapProperty={"editedClientPetSpecies"}
                        selectedItemProperty={"editedClientSelectedSpecies"}
                        itemToString={species => species.name ? species.name : ""}
                        getKey={species => species && species.id ? species.id : 0}
                    />
                </div>
                <div className={styles.petBreedSelect}>
                    <ConnectedSelect<Breed, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        mapProperty={"editedClientPetBreeds"}
                        selectedItemProperty={"editedClientSelectedBreed"}
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