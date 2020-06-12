import * as React from "react";
import {Message} from "../../../../../../core/components/Message";
import {Paper} from "@material-ui/core";
import {
    Appointments,
    DateNavigator, DragDropProvider,
    MonthView,
    Scheduler,
    Toolbar,
    WeekView
} from "@devexpress/dx-react-scheduler-material-ui";
import {AppointmentModel, ChangeSet, EditingState, IntegratedEditing, ViewState} from "@devexpress/dx-react-scheduler";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import {AppointmentInfo} from "../../../../../../common/beans/AppointmentInfo";
import CustomPopover from "../../../../../../core/components/customPopover/CustomPopover";
import {ReactNode, RefObject} from "react";
import DayScheduleContent from "../../../../../../common/components/dayScheduleContent/DayScheduleContent";
import {DaySchedule} from "../../../../../../common/beans/DaySchedule";
import {ClinicWorkScheduleDeviation} from "../../../../../../common/beans/ClinicWorkScheduleDeviation";
import DeviationDayScheduleContent
    , {DeviationDayScheduleConfirmFunction} from "../../../../../../common/components/deviationDayScheduleContent/DeviationDayScheduleContent";
import {ScheduleRecord} from "../../../../../../common/beans/ScheduleRecord";
import {LocaleUtils} from "../../../../../../core/enum/LocaleType";
import LocaleHolder from "../../../../../../core/utils/LocaleHolder";

const styles = require("../../styles.css")
export default class DeviationsSection extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            deviationAppointments: [],
            deviations: new Map(),
        }
    }

    private getDeviationByDate(date: Date): AppointmentModel | null {
        const result = this.state.deviationAppointments.filter(appointment => {
            return date >= appointment.startDate && date <= appointment.endDate
        })
        return result.length > 0 ? result[0] : null
    }

    private getDayScheduleContent(id: number | undefined, startDate: Date, endDate: Date, global: boolean, name: string, schedule: DaySchedule, onConfirmClick: DeviationDayScheduleConfirmFunction) {
        return (
            <DeviationDayScheduleContent
                name={name}
                global={global}
                startDate={startDate}
                endDate={endDate}
                controller={this.props.controller}
                schedule={schedule}
                label={<Message messageKey={"second.navigation.clinicsManagement.workSchedule.popover.label"}/>}
                onConfirmClick={onConfirmClick}
                onDeleteClick={id ? () => this.props.controller.clinicsWorkScheduleActions.deleteDeviation(id) : undefined}
            />
        )
    }

    private getDayScheduleContentById(id: number) {
        const deviation = this.state.deviations.get(id)!
        const deviationData = deviation.getDeviationData()
        return this.getDayScheduleContent(
            id,
            deviationData.getStartDate(),
            deviationData.getEndDate(),
            deviation.isGlobal(),
            deviation.getName(),
            deviationData.getChanges(),
            (name: string, global: boolean, startDate: Date, endDate: Date, records: ScheduleRecord[]) =>
                this.props.controller.clinicsWorkScheduleActions.updateDeviation(id, name, global, startDate, endDate, records)
            )
    }

    private getDayScheduleContentByDate(date: Date): ReactNode {
        const appointment = this.getDeviationByDate(date)
        if (appointment) {
            return this.getDayScheduleContentById(appointment.id as number)
        } else {
            return this.getDayScheduleContent(
                undefined,
                date,
                date,
                false,
                "",
                new DaySchedule([]),
                this.props.controller.clinicsWorkScheduleActions.addDeviation)
        }
    }

    private getAppointmentContent(): React.ComponentType<Appointments.AppointmentContentProps> {
        const self = this
        return class extends React.Component<Appointments.AppointmentContentProps> {
            render() {
                return (
                    <CustomPopover
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        className={styles.appointmentContentWrapper}
                        popoverContent={() => self.getDayScheduleContentById(this.props.data.id as number)}>
                        <Appointments.AppointmentContent
                            {...this.props}
                        />
                    </CustomPopover>

                )
            }
        }
    }

    private getTimeTableCell(onClick: (appointment: AppointmentInfo) => void): React.ComponentType<MonthView.TimeTableCellProps> {
        const self = this
        return class extends React.Component<MonthView.TimeTableCellProps> {

            private ref: RefObject<HTMLDivElement>
            constructor(props: MonthView.TimeTableCellProps) {
                super(props)
                this.ref = React.createRef()
            }

            render() {
                return (
                    <WeekView.TimeTableCell
                        {...this.props}
                    >
                        <CustomPopover
                            className={styles.scheduleCell}
                            popoverContent={() => self.getDayScheduleContentByDate(this.props.startDate)}
                            getRef={() => {}}
                            onClose={() => {}}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            {this.props.startDate.getDate()}
                            {this.props.children}
                        </CustomPopover>
                    </WeekView.TimeTableCell>
                )
            }
        }
    }

    render() {
        const TTCell = this.getTimeTableCell((info: AppointmentInfo) => {})
        const AppointmentComponent = this.getAppointmentContent()
        const actions = this.props.controller.clinicsWorkScheduleActions
        const localeTag = LocaleUtils.getLocaleTag(LocaleHolder.instance.localeType)
        return (
            <div className={styles.deviationSection}>
                <div className={styles.deviationSectionTitle}>
                    <Message messageKey={"page.clinicsWorkSchedule.deviationSection.label"}/>
                </div>
                <div className={styles.deviationContent}>
                    <Paper>
                        <Scheduler
                            data={this.state.deviationAppointments}
                            locale={localeTag}
                        >
                            <ViewState/>
                            <MonthView
                                timeTableCellComponent={TTCell}
                            />
                            <EditingState
                                onCommitChanges={(changes: ChangeSet) => actions.handleDeviationAppointmentChange(changes)}
                                onEditingAppointmentChange={(editedAppointment: Object) => {}}
                                onAddedAppointmentChange={(addedAppointment: Object) => {}}
                            />
                            <IntegratedEditing/>
                            <Appointments
                                appointmentContentComponent={AppointmentComponent}
                            />
                            <Toolbar/>
                            <DateNavigator/>
                            <DragDropProvider/>
                        </Scheduler>
                    </Paper>
                </div>
            </div>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
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
    deviationAppointments: AppointmentModel[]
    deviations: Map<number, ClinicWorkScheduleDeviation>
}