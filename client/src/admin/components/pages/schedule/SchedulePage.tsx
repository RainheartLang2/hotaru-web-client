import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {Paper} from "@material-ui/core";
import {
    Appointments,
    DayView,
    WeekView,
    Scheduler,
    DragDropProvider,
    EditRecurrenceMenu
} from "@devexpress/dx-react-scheduler-material-ui";
import {EditingState, ViewState} from "@devexpress/dx-react-scheduler";

export default class SchedulePage extends React.Component {
    render() {
        const currentDate = '2018-11-01';
        const schedulerData = [
            { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
            { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
        ];
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
                    <EditingState
                        onCommitChanges={() => {}}
                        onEditingAppointmentChange={() => {}}
                        onAddedAppointmentChange={() => {}}
                    />
                    <EditRecurrenceMenu/>
                    <WeekView
                        startDayHour={9}
                        endDayHour={19}
                    />
                    <Appointments/>
                    <DragDropProvider/>
                </Scheduler>
            </Paper>
        </>)
    }
}