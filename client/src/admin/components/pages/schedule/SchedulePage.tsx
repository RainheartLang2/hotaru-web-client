import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {Paper} from "@material-ui/core";
import {
    AppointmentForm,
    Appointments,
    AppointmentTooltip,
    DateNavigator,
    DragDropProvider,
    Scheduler,
    TodayButton,
    Toolbar,
    WeekView
} from "@devexpress/dx-react-scheduler-material-ui";
import {EditingState, IntegratedEditing, ViewState} from "@devexpress/dx-react-scheduler";
import AdminAppController from "../../../controller/AdminAppController";
import AppointmentMockForm from "./subcomponents/mockForm/AppointmentMockForm";

export default class SchedulePage extends React.Component<Properties> {
    render() {
        const currentDate = '2018-11-01';
        const schedulerData = [
            { startDate: '2018-11-01T09:42', endDate: '2018-11-01T11:06', title: 'Meeting' },
            { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
        ]
        const actions = this.props.controller.appointmentActions
        return (<>
            <PageHeader
                label={(<Message messageKey={"page.schedule.title"}/>)}
                hasButton={false}
            />
            <Paper>
                <Scheduler
                    data={schedulerData}
                    firstDayOfWeek={1}
                >
                    <ViewState
                        currentDate={currentDate}
                    />
                    <WeekView
                        startDayHour={9}
                        endDayHour={19}
                    />
                    <EditingState
                        onCommitChanges={() => {console.log("onCommit")}}
                        onEditingAppointmentChange={() => {console.log("onEditing")}}
                        onAddedAppointmentChange={() => actions.openCreateAppointmentDialog()}
                    />
                    <IntegratedEditing/>
                    <Appointments/>
                    <AppointmentForm
                        overlayComponent={AppointmentMockForm}
                    />
                    <Toolbar/>
                    <DateNavigator />
                    <TodayButton />
                    <DragDropProvider/>
                </Scheduler>
            </Paper>
        </>)
    }
}

type Properties = {
    controller: AdminAppController
}