import EmployeeAppController from "../../../controller/EmployeeAppController";
import * as React from "react";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import EmployeeApplicationStore, {
    EmployeeAppSelectors,
    EmployeeAppState
} from "../../../state/EmployeeApplicationStore";
import {Message} from "../../../../core/components/Message";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import {Clinic} from "../../../../common/beans/Clinic";
import ConnectedCheckbox from "../../../../core/components/connectedCheckbox/ConnectedCheckbox";
import WorkScheduleTemplate from "../../../../common/components/workScheduleTemplate/WorkScheduleTemplate";
import {ClinicWorkSchedule} from "../../../../common/beans/ClinicWorkSchedule";
import WorkSchedule from "../../../../common/beans/WorkSchedule";
import {AppointmentModel} from "@devexpress/dx-react-scheduler";
import DeviationsSection from "./subcomponents/deviationsSection/DeviationsSection";
import {ScheduleRecord} from "../../../../common/beans/ScheduleRecord";

var styles = require("./styles.css")

export default class ClinicsWorkschedulePage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            showDefaultScheduleCheckBox: false,
            editingDisabled: true,
            workSchedule: null,
            useDefaultWorkSchedule: true,
            deviations: [],
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
                            label={<Message messageKey={"page.clinicsWorkSchedule.userDefaultSchedule.label"}/>}
                            onClick={(checked: boolean) => this.props.controller.clinicsWorkScheduleActions.setUsesDefault(checked)}
                            value={this.state.useDefaultWorkSchedule}
                        />
                    }
                    <div className={styles.workScheduleWrapper}>
                        <WorkScheduleTemplate
                            controller={this.props.controller}
                            schedule={this.state.workSchedule
                                ? this.state.workSchedule.schedule
                                : new WorkSchedule(7)}
                            scheduleLength={"week"}
                            disabled={this.state.editingDisabled}
                            disabledTooltipLabel={<Message messageKey={"page.clinicsWorkSchedule.defaultWorkSchedule.disable.tooltip.label"}/>}
                            onScheduleChange={(day: number, records: ScheduleRecord[]) => this.props.controller.clinicsWorkScheduleActions.setDaySchedule(day, records)}
                        />
                    </div>
                </div>
            </div>
            <DeviationsSection
                disabled={this.state.editingDisabled}
                controller={this.props.controller}
            />
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            clinicsWorkScheduleShowDefaultCheckBox: "showDefaultScheduleCheckBox",
            clinicsWorkScheduleDisableEditing: "editingDisabled",
            workScheduleForSelectedClinic: "workSchedule",
            clinicsWorkScheduleUsesDefault: "useDefaultWorkSchedule",
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
    editingDisabled: boolean,
    showDefaultScheduleCheckBox: boolean,
    workSchedule: ClinicWorkSchedule | null,
    useDefaultWorkSchedule: boolean,
    deviations: AppointmentModel[],
}