import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {Paper} from "@material-ui/core";
import {
    Appointments, AppointmentTooltip,
    DateNavigator,
    DragDropProvider,
    Scheduler,
    TodayButton,
    Toolbar,
    WeekView
} from "@devexpress/dx-react-scheduler-material-ui";
import {AppointmentModel, ChangeSet, EditingState, IntegratedEditing, ViewState} from "@devexpress/dx-react-scheduler";
import {Employee} from "../../../../common/beans/Employee";
import {NameUtils} from "../../../../core/utils/NameUtils";
import LocaleHolder from "../../../../core/utils/LocaleHolder";
import {LocaleUtils} from "../../../../core/enum/LocaleType";
import MessageResource from "../../../../core/message/MessageResource";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import EmployeeApplicationStore, {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import {AppointmentInfo} from "../../../../common/beans/AppointmentInfo";
import {DaySchedule} from "../../../../common/beans/DaySchedule";
import CustomTooltip from "../../../../core/components/customTooltip/CustomTooltip";

var styles = require("./styles.css")

export default class SchedulePage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            appointmentsList: [],
            selectedDate: new Date(),
            employeeSchedule: [],
            hoursRange: [0, 24],
        }
    }

    private isDateRangeActive(startDate: Date, endDate: Date): boolean {
        const daySchedule = this.state.employeeSchedule.length > 0
            ? this.state.employeeSchedule[startDate.getDay()]
            : new DaySchedule([])
        return daySchedule.includes(startDate, endDate)
    }

    private getTimeTableCell(onClick: (appointment: AppointmentInfo) => void): React.ComponentType<WeekView.TimeTableCellProps> {
        const self = this
        return class extends React.Component<WeekView.TimeTableCellProps> {
            render() {
                const isActive = self.isDateRangeActive(this.props.startDate!, this.props.endDate!)
                return (
                    <WeekView.TimeTableCell
                        {...this.props}>
                        <CustomTooltip
                            title={<Message messageKey={"page.schedule.nonWorkingTime.tooltip.label"}/>}
                            active={!isActive}
                        >
                            <div className={isActive ? styles.timeTableCell : styles.inactiveTimeTableCell} onClick={() => {
                                onClick({
                                    startDate: this.props.startDate!,
                                    endDate: this.props.endDate!,
                                })
                            }}></div>
                        </CustomTooltip>
                    </WeekView.TimeTableCell>
                )
            }
        }
    }

    private getAppointmentTooltipHeader(onOpenButtonClick: (info: AppointmentInfo) => void,
                                        onDeleteButtonClick: (info: AppointmentInfo, callback: Function) => void
    ): React.ComponentType<AppointmentTooltip.HeaderProps > {
        return class extends React.Component<AppointmentTooltip.HeaderProps> {
            render() {
                const appointmentInfo = this.props.appointmentData as AppointmentInfo
                return (
                    // @ts-ignore
                    <AppointmentTooltip.Header
                        {...this.props}
                        onOpenButtonClick={() => onOpenButtonClick(appointmentInfo)}
                        onDeleteButtonClick={() => {
                            onDeleteButtonClick(appointmentInfo, () => this.props.onDeleteButtonClick!())
                        }}
                    >
                        {this.props.children}
                    </AppointmentTooltip.Header>
                )
            }
        }
    }

    private startAppointmentCreation(appointmentInfo: AppointmentInfo) {
        if (this.isDateRangeActive(appointmentInfo.startDate!, appointmentInfo.endDate!)) {
            this.props.controller.scheduleActions.openCreateAppointmentDialog(appointmentInfo)
        }
    }

    private openEditDialog(appointmentInfo: AppointmentInfo) {
        this.props.controller.scheduleActions.openEditAppointmentDialog(appointmentInfo)
    }

    render() {
        const currentDate = this.state.selectedDate
        const localeTag = LocaleUtils.getLocaleTag(LocaleHolder.instance.localeType)
        const schedulerData = this.state.appointmentsList
        const actions = this.props.controller.scheduleActions

        const TTCell = this.getTimeTableCell((info: AppointmentInfo) => this.startAppointmentCreation(info))
        const TooltipHeader = this.getAppointmentTooltipHeader((info: AppointmentInfo) => this.openEditDialog(info),
            (info: AppointmentInfo, callback: Function) => this.props.controller.scheduleActions.deleteAppointment(info.id!, callback))
        return (<>
            <PageHeader
                label={(<Message messageKey={"page.schedule.title"}/>)}
                hasButton={false}
            />
            <div className={styles.medicSelect}>
                <ConnectedSelect<Employee, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                    controller={this.props.controller}
                    variant={"outlined"}
                    mapProperty={"medicsListById"}
                    selectedItemProperty={"selectedEmployeeForSchedulePage"}
                    itemToString={medic => NameUtils.formatName(medic)}
                    getKey={medic => medic && medic.id ? medic.id : 0}
                    label={<Message messageKey={"page.schedule.medicSelection.label"}/>}
                />
            </div>
            <Paper>
                <Scheduler
                    locale={localeTag}
                    data={schedulerData}
                    firstDayOfWeek={1}
                >
                    <ViewState
                        currentDate={currentDate}
                        onCurrentDateChange={(currentDate: Date) => actions.changeWeek(currentDate)}
                    />
                    <WeekView
                        startDayHour={this.state.hoursRange[0]}
                        endDayHour={this.state.hoursRange[1]}
                        timeTableCellComponent={TTCell}
                    />
                    <EditingState
                        onCommitChanges={(changes: ChangeSet) =>
                            actions.handleAppointmentChange(changes,
                                (startDate: Date, endDate: Date) => this.isDateRangeActive(startDate, endDate)
                            )
                        }
                        onEditingAppointmentChange={(editedAppointment: Object) => {
                            if (editedAppointment && !editedAppointment.hasOwnProperty("type")) {
                                const appointmentInfo = editedAppointment as AppointmentInfo
                                if (this.isDateRangeActive(appointmentInfo.startDate, appointmentInfo.endDate)) {
                                    this.openEditDialog(editedAppointment as AppointmentInfo)
                                }
                            }
                        }}
                        onAddedAppointmentChange={(addedAppointment: Object) => this.startAppointmentCreation(addedAppointment as AppointmentInfo)}
                    />
                    <IntegratedEditing/>
                    <Appointments/>
                    <AppointmentTooltip
                        showOpenButton
                        showCloseButton
                        showDeleteButton
                        headerComponent={TooltipHeader}
                    />
                    <Toolbar/>
                    <DateNavigator/>
                    <TodayButton
                        messages={{
                            today: MessageResource.getMessage("page.schedule.todayButton.label")
                        }}
                    />
                    <DragDropProvider/>
                </Scheduler>
            </Paper>
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            appointmentsModelList: "appointmentsList",
            schedulePageDate: "selectedDate",
            personalSchedule: "employeeSchedule",
            personalScheduleHours: "hoursRange",
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
    appointmentsList: AppointmentModel[]
    selectedDate: Date
    employeeSchedule: DaySchedule[]
    hoursRange: [number, number]
}