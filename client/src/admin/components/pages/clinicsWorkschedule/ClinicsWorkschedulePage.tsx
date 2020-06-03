import EmployeeAppController from "../../../controller/EmployeeAppController";
import * as React from "react";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import EmployeeApplicationStore from "../../../state/EmployeeApplicationStore";
import {Message} from "../../../../core/components/Message";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import {Clinic} from "../../../../common/beans/Clinic";
import ConnectedCheckbox from "../../../../core/components/connectedCheckbox/ConnectedCheckbox";
import WorkScheduleTemplate from "../../../../common/components/workScheduleTemplate/WorkScheduleTemplate";
import {ClinicWorkSchedule} from "../../../../common/beans/ClinicWorkSchedule";
import WorkSchedule from "../../../../common/beans/WorkSchedule";

var styles = require("./styles.css")

export default class ClinicsWorkschedulePage extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            showDefaultScheduleCheckBox: false,
            editingDisabled: true,
            workSchedule: null,
        }
    }

    render() {
        return (<>
            <PageHeader label={<Message messageKey={"page.clinicsWorkSchedule.title"}/>}
                        hasButton={false}
                        buttonOnClick={() => {}}/>
            <div>
                <div>
                    <ConnectedSelect<Clinic, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        variant={"outlined"}
                        mapProperty={"clinicsByIdWithDefaultWorkSchedule"}
                        selectedItemProperty={"clinicsWorkScheduleSelectedClinic"}
                        itemToString={clinic => clinic.name!}
                        getKey={clinic => clinic && clinic.id ? clinic.id : 0}
                        label={<Message messageKey={"page.clinicsWorkSchedule.clinicSelect"}/>}
                    />
                    {this.state.showDefaultScheduleCheckBox &&
                        <ConnectedCheckbox<EmployeeAppState>
                            controller={this.props.controller}
                            propertyName={"clinicsWorkScheduleUseDefault"}
                            label={<Message messageKey={"page.clinicsWorkSchedule.userDefaultSchedule.label"}/>}
                        />
                    }
                    <div className={styles.workScheduleWrapper}>
                        <WorkScheduleTemplate
                            schedule={this.state.workSchedule
                                ? this.state.workSchedule.schedule
                                : new WorkSchedule(7, new Map())}
                            scheduleLength={"week"}
                            disabled={this.state.editingDisabled}/>
                    </div>
                </div>
            </div>
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            clinicsWorkScheduleShowDefaultCheckBox: "showDefaultScheduleCheckBox",
            clinicsWorkScheduleDisableEditing: "editingDisabled",
            workScheduleForSelectedClinic: "workSchedule",
        })
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    editingDisabled: boolean,
    showDefaultScheduleCheckBox: boolean,
    workSchedule: ClinicWorkSchedule | null,
}