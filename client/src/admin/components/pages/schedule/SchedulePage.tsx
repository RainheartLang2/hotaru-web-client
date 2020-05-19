import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {Paper} from "@material-ui/core";
import {
    AppointmentForm,
    Appointments,
    DateNavigator,
    DragDropProvider,
    Scheduler,
    TodayButton,
    Toolbar,
    WeekView
} from "@devexpress/dx-react-scheduler-material-ui";
import {AppointmentModel, ChangeSet, EditingState, IntegratedEditing, ViewState} from "@devexpress/dx-react-scheduler";
import AdminAppController from "../../../controller/AdminAppController";
import AppointmentMockForm from "./subcomponents/mockForm/AppointmentMockForm";
import {AdminStateProperty} from "../../../state/AdminApplicationState";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import {Employee} from "../../../../common/beans/Employee";
import {NameUtils} from "../../../../core/utils/NameUtils";
import LocaleHolder from "../../../../core/utils/LocaleHolder";
import {LocaleUtils} from "../../../../core/enum/LocaleType";
import MessageResource from "../../../../core/message/MessageResource";

var styles = require("./styles.css")

export default class SchedulePage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            [StateProperty.AppointmentList]: [],
            [StateProperty.SelectedDate]: new Date(),
        }
    }

    render() {
        const currentDate = this.state[StateProperty.SelectedDate]
        const localeTag = LocaleUtils.getLocaleTag(LocaleHolder.instance.localeType)
        const schedulerData = this.state[StateProperty.AppointmentList]
        const actions = this.props.controller.appointmentActions
        return (<>
            <PageHeader
                label={(<Message messageKey={"page.schedule.title"}/>)}
                hasButton={false}
            />
            <div className={styles.medicSelect}>
                <ConnectedSelect<Employee>
                    controller={this.props.controller}
                    variant={"outlined"}
                    mapProperty={AdminStateProperty.MedicsListById}
                    selectedItemProperty={AdminStateProperty.SelectedEmployeeForSchedulePage}
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
                        startDayHour={9}
                        endDayHour={19}
                    />
                    <EditingState
                        onCommitChanges={(changes: ChangeSet) => actions.handleAppointmentChange(changes)}
                        onEditingAppointmentChange={(editedAppointment: Object) => {
                            if (editedAppointment && !editedAppointment.hasOwnProperty("type")) {
                                actions.openEditAppointmentDialog(editedAppointment)
                            }
                        }}
                        onAddedAppointmentChange={(addedAppointment: Object) => actions.openCreateAppointmentDialog(addedAppointment)}
                    />
                    <IntegratedEditing/>
                    <Appointments/>
                    <AppointmentForm
                        overlayComponent={AppointmentMockForm}
                    />

                    <Toolbar/>
                    <DateNavigator />
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
        this.props.controller.subscribeBatched(this, [
            {propertyName: AdminStateProperty.AppointmentModelsList, propertyAlias: StateProperty.AppointmentList},
            {propertyName: AdminStateProperty.SchedulePageDate, propertyAlias: StateProperty.SelectedDate}
        ])
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

enum StateProperty {
    AppointmentList = "appointmentList",
    SelectedDate = "selectedDate",
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.AppointmentList]: AppointmentModel[]
    [StateProperty.SelectedDate]: Date
}