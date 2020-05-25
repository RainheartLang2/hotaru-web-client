import * as React from "react";
import {ReactNode} from "react";
import {Message} from "../../../../../../core/components/Message";
import LabeledSwitch from "../../../../../../core/components/labeledSwitch/LabeledSwitch";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../../../state/EmployeeApplicationStore";
import ConnectedTextField from "../../../../../../core/components/conntectedTextField/ConnectedTextField";
import ImageDropZone from "../../../../../../core/components/imageDropZone/ImageDropZone";

var styles = require("../../styles.css")

export default class ClinicRightColumn extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            logoImage: null,
        }
    }

    private getActiveSwitch(): ReactNode {
        return (
            <div className={styles.row}>
                <LabeledSwitch
                    active={this.props.active}
                    onChange={(event, checked) => this.props.controller.clinicActions.toggleClinicActivity(checked)}
                    activeLabelKey={"dialog.clinic.active.label"}
                    notActiveLabelKey={"dialog.clinic.notActive.label"}
                />
            </div>
        )
    }

    render() {
        return (<>
            <div className={styles.logoDropZone}>
                <ImageDropZone
                    dropZoneNoteKey={"dialog.clinic.logo.dropzone.note"}
                    image={this.state.logoImage}
                    onImageChange={(image: string) => this.props.controller.setState({editedClinicLogo: image})}
                />
            </div>
            {this.props.showActiveSwitch
                ? this.getActiveSwitch()
                : ""}
            <div className={styles.row}>
                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                    controller={this.props.controller}
                    fieldKey={{editedClinicPhone:"editedClinicPhoneField"}}
                    label={(<Message messageKey={"dialog.clinic.phone.label"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                    mask={"+7(???)-???-??-??"}
                />
            </div>
            <div className={styles.row}>
                <ConnectedTextField<EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                    controller={this.props.controller}
                    fieldKey={{editedClinicEmail: "editedClinicEmailField"}}
                    label={(<Message messageKey={"dialog.clinic.email.label"}/>)}
                    required={true}
                    size="small"
                    fullWidth={true}
                />
            </div>
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            editedClinicLogo: "logoImage",
        })
    }
}

export type Properties = {
    controller: EmployeeAppController,
    active: boolean,
    showActiveSwitch: boolean,
}

export type State = {
   logoImage: string | null,
}