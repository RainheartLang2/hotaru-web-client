import * as React from "react";
import {Message} from "../../../../../../core/components/Message";
import {Paper} from "@material-ui/core";
import {
    Appointments,
    DateNavigator,
    MonthView,
    Scheduler,
    Toolbar,
    WeekView
} from "@devexpress/dx-react-scheduler-material-ui";
import {AppointmentModel, ChangeSet, EditingState, IntegratedEditing, ViewState} from "@devexpress/dx-react-scheduler";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import {AppointmentInfo} from "../../../../../../common/beans/AppointmentInfo";

const styles = require("../../styles.css")

export default class DeviationsSection extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            deviations: [],
        }
    }

    private getTimeTableCell(onClick: (appointment: AppointmentInfo) => void): React.ComponentType<MonthView.TimeTableCellProps> {
        return class extends React.Component<MonthView.TimeTableCellProps> {
            render() {
                return (
                    <WeekView.TimeTableCell
                        {...this.props}>
                        <div className={styles.scheduleCell} onClick={() => {
                            onClick({
                                startDate: this.props.startDate!,
                                endDate: this.props.endDate!,
                            })
                        }}></div>
                    </WeekView.TimeTableCell>
                )
            }
        }
    }

    render() {
        const TTCell = this.getTimeTableCell((info: AppointmentInfo) => {})
        return (
            <div className={styles.deviationSection}>
            <div className={styles.deviationSectionTitle}>
                <Message messageKey={"page.clinicsWorkSchedule.deviationSection.label"}/>
            </div>
            <div className={styles.deviationContent}>
                <Paper>
                    <Scheduler
                        data={this.state.deviations}
                    >
                        <ViewState/>
                        <MonthView
                            timeTableCellComponent={TTCell}
                        />
                        <EditingState
                            onCommitChanges={(changes: ChangeSet) => {}}
                            onEditingAppointmentChange={(editedAppointment: Object) => {
                            }}
                            onAddedAppointmentChange={(addedAppointment: Object) => {}}
                        />
                        <IntegratedEditing/>
                        <Appointments/>
                        <Toolbar/>
                        <DateNavigator/>
                    </Scheduler>
                </Paper>
            </div>
        </div>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            clinicsScheduleDeviationsAppointments: "deviations",
        })
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    deviations: AppointmentModel[]
}