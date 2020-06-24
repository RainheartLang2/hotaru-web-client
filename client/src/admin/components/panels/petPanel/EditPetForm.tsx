import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {Message} from "../../../../core/components/Message";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import Species from "../../../../common/beans/Species";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";

var styles = require("./styles.css");

export default class EditPetForm extends React.Component<Properties, State> {
    render() {
        return (
            <div className={styles.form}>
                <div className={styles.title}>
                    <Message messageKey={"panel.pet.title"}/>
                </div>
                <div className={styles.content}>
                    <div className={styles.row}>
                        <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                            controller={this.props.controller}
                            fieldKey={{editedPetName: "editedPetNameField"}}
                            label={<Message messageKey={"panel.pet.field.name.label"}/>}
                        />
                    </div>
                    <div className={styles.row}>
                        <ConnectedAutoCompleteField<Species, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                            controller={this.props.controller}
                            itemToString={species => species.name!}
                            selectedItemProperty={"editedPetSpecies"}
                            label={<Message messageKey={"panel.pet.field.species.label"}/>}
                            itemsProperty={"speciesList"}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {

}