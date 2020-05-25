import * as React from "react";
import {Message} from "../../../../../../core/components/Message";
import CredentialsSection from "../credentialsSection/CredentialsSection";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";
import EmployeeApplicationStore, {EmployeeAppSelectors, EmployeeAppState} from "../../../../../state/EmployeeApplicationStore";
import ImageDropZone from "../../../../../../core/components/imageDropZone/ImageDropZone";

var styles = require("./../../styles.css")

export default class LeftColumn extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            employeePhoto: null,
        }
    }
    render() {
        return (
            <>
                <div className={styles.photoDropZone}>
                    <ImageDropZone
                        dropZoneNoteKey={"dialog.employee.dropzone.note"}
                        image={this.state.employeePhoto}
                        onImageChange={(image: string) => {
                            this.props.controller.setState({employeePhoto: image})
                        }}/>

                </div>
                <div className={this.props.rowStyle}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeLastName: "editedEmployeeLastNameField"}}
                        label={(<Message messageKey={"dialog.employee.field.lastName.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <div className={this.props.rowStyle}>
                    <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeFirstName: "editedEmployeeFirstNameField"}}
                        label={(<Message messageKey={"dialog.employee.field.firstName.label"}/>)}
                        required={true}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <div className={this.props.rowStyle}>
                     <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        fieldKey={{editedEmployeeMiddleName: "editedEmployeeMiddleNameField"}}
                        label={(<Message messageKey={"dialog.employee.field.middleName.label"}/>)}
                        size="small"
                        fullWidth={true}
                    />
                </div>
                <CredentialsSection controller={this.props.controller}/>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            employeePhoto: "employeePhoto",
        })
    }
}

export type State = {
   employeePhoto: string | null,
}

export type Properties = {
    controller: EmployeeAppController,
    rowStyle: string,
}