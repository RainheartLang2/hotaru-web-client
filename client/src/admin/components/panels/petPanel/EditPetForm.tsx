import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {Message} from "../../../../core/components/Message";
import ConnectedTextField from "../../../../core/components/conntectedTextField/ConnectedTextField";
import ConnectedAutoCompleteField from "../../../../core/components/connectedAutoComplete/ConnectedAutoCompleteField";
import Species from "../../../../common/beans/Species";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import Breed from "../../../../common/beans/Breed";
import {AnimalColor} from "../../../../common/beans/AnimalColor";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import {Sex} from "../../../../common/beans/enums/Sex";
import CustomButton from "../../../../core/components/customButton/CustomButton";
import {ConfigureType} from "../../../../core/types/ConfigureType";

var styles = require("./styles.css");

export default class EditPetForm extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            mode: "none",
            hasErrors: false,
        }
    }

    private onSubmitButtonClick(): void {
        if (this.state.mode == "create") {
            this.props.controller.petActions.addPet()
        } else if (this.state.mode == "edit") {
            this.props.controller.petActions.editPet()
        }
    }

    render() {
        return (
            <div className={styles.form}>
                <div className={styles.saveButton}>
                    <CustomButton
                        controller={this.props.controller}
                        onClick={() => this.onSubmitButtonClick()}
                        disabled={this.state.hasErrors}
                    >
                        <Message messageKey={"common.button.save"}/>
                    </CustomButton>
                </div>
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
                            onChange={(value) => {
                                    this.props.controller.setState({
                                        editedPetBreed: null,
                                    })
                            }}
                            required={true}
                        />
                    </div>
                    <div className={styles.row}>
                        <ConnectedAutoCompleteField<Breed, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                            controller={this.props.controller}
                            itemToString={breed => breed.name!}
                            selectedItemProperty={"editedPetBreed"}
                            label={<Message messageKey={"panel.pet.field.breed.label"}/>}
                            itemsProperty={"editedPetBreedsList"}
                        />
                    </div>
                    <div className={styles.row}>
                        <ConnectedAutoCompleteField<AnimalColor, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                            controller={this.props.controller}
                            itemToString={color => color.name!}
                            selectedItemProperty={"editedPetColor"}
                            label={<Message messageKey={"panel.pet.field.color.label"}/>}
                            itemsProperty={"animalColorsList"}
                        />
                    </div>
                    <div className={styles.row}>
                        <ConnectedSelect<Sex | null, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                            controller={this.props.controller}
                            label={<Message messageKey={"panel.pet.field.sex.label"}/>}
                            mapProperty={"sexesMapForSelect"}
                            selectedItemProperty={"editedPetSex"}
                            itemToString={sex => Sex.getStringForSelect(sex)}
                            getKey={sex => Sex.getKeyForSelect(sex)}
                        />
                    </div>
                    <div className={styles.row}>
                        <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                            controller={this.props.controller}
                            fieldKey={{editedPetBirthDate: "editedPetBirthDateField"}}
                            label={<Message messageKey={"panel.pet.field.birthDate.label"}/>}
                            type={"date"}
                        />
                    </div>
                    <div className={styles.row}>
                        <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                            controller={this.props.controller}
                            fieldKey={{editedPetNote: "editedPetNoteField"}}
                            label={<Message messageKey={"panel.pet.field.note.label"}/>}
                            rows={4}
                        />
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            editedPetFormMode: "mode",
            editPetFormHasErrors: "hasErrors",
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
    mode: ConfigureType
    hasErrors: boolean
}