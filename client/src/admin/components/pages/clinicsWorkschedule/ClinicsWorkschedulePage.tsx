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
import {AppointmentModel, ChangeSet} from "@devexpress/dx-react-scheduler";
import DeviationsSection from "./subcomponents/deviationsSection/DeviationsSection";
import {ScheduleRecord} from "../../../../common/beans/ScheduleRecord";
import {WorkScheduleDeviationContainer} from "../../../../common/beans/WorkScheduleDeviationContainer";

var styles = require("./styles.css")

export default class ClinicsWorkschedulePage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            showDefaultScheduleCheckBox: false,
            editingDisabled: true,
            workSchedule: null,
            useDefaultWorkSchedule: true,
            deviationAppointments: [],
            deviations: new Map(),
        }
    }

    render() {
        const actions = this.props.controller.clinicsWorkScheduleActions
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
                deviationAppointments={this.state.deviationAppointments}
                deviations={this.state.deviations}
                handleChanges={(changes: ChangeSet) => actions.handleDeviationAppointmentChange(changes)}
                onAddClick={(name: string, global: boolean, startDate: Date, endDate: Date, records: ScheduleRecord[]) =>
                    actions.addDeviation(name, global, startDate, endDate, records)}
                onUpdateClick={(id: number,
                                name: string,
                                global: boolean,
                                startDate: Date,
                                endDate: Date,
                                records: ScheduleRecord[]) => actions.updateDeviation(id, name, global, startDate, endDate, records)}
                onDeleteClick={(id: number) => actions.deleteDeviation(id)}
            />
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            clinicsWorkScheduleShowDefaultCheckBox: "showDefaultScheduleCheckBox",
            clinicsWorkScheduleDisableEditing: "editingDisabled",
            workScheduleForSelectedClinic: "workSchedule",
            clinicsWorkScheduleUsesDefault: "useDefaultWorkSchedule",
            clinicsScheduleDeviationsAppointments: "deviationAppointments",
            clinicsScheduleDeviationsById: "deviations",
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
    deviationAppointments: AppointmentModel[],
    deviations: Map<number, WorkScheduleDeviationContainer>,
}