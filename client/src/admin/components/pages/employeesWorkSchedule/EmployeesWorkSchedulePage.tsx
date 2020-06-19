import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import ConnectedSelect from "../../../../core/components/ConnectedSelect/ConnectedSelect";
import {EmployeeRecord} from "../../../state/nodes/EmployeeWorkScheduleNode";
import EmployeeApplicationStore, {EmployeeAppSelectors, EmployeeAppState} from "../../../state/EmployeeApplicationStore";
import ConnectedCheckbox from "../../../../core/components/connectedCheckbox/ConnectedCheckbox";
import WorkScheduleTemplate from "../../../../common/components/workScheduleTemplate/WorkScheduleTemplate";
import WorkSchedule from "../../../../common/beans/WorkSchedule";
import EmployeeWorkSchedule from "../../../../common/beans/EmployeeWorkSchedule";
import {ScheduleRecord} from "../../../../common/beans/ScheduleRecord";
import {ReactNode} from "react";
import {CollectionUtils} from "../../../../core/utils/CollectionUtils";
import {MenuItem} from "@material-ui/core";
import Select from "@material-ui/core/Select";

var styles = require("./styles.css")

const WeeklySelectIndex = -1
export default class EmployeesWorkSchedulePage extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            showDefaultScheduleCheckBox: false,
            editingDisabled: true,
            workSchedule: null,
            useDefaultWorkSchedule: true,
        }
    }

    private getScheduleLengthSelect(): ReactNode {
        if (!this.state.workSchedule) {
            return ""
        }

        const options = CollectionUtils.getSimpleNumberArray(14).map(dayNumber =>
            <MenuItem value={dayNumber + 1}>
                <Message messageKey={"common.days." + (dayNumber + 1)}/>
            </MenuItem>)

        options.push(
            <MenuItem value={WeeklySelectIndex}>
                <Message messageKey={"common.weekly"}/>
            </MenuItem>
        )

        const value = this.state.workSchedule.getWorkSchedule().isWeekly()
                        ? WeeklySelectIndex
                        : this.state.workSchedule.getWorkSchedule().length
        return (<Select
            onChange={event => {
                const index = event.target.value as number
                if (index == WeeklySelectIndex) {
                    this.props.controller.employeeScheduleActions.setWeekly()
                } else {
                    this.props.controller.employeeScheduleActions.setScheduleLength(event.target.value as number)
                }
            }}
            value={value}
            fullWidth={true}
            variant={"outlined"}
        >
            {options}
        </Select>)
    }

    render() {
        const schedule = this.state.workSchedule
            ? this.state.workSchedule.getWorkSchedule()
            : new WorkSchedule(7)
        const scheduleLength = this.state.workSchedule && !this.state.workSchedule.getWorkSchedule().isWeekly() ? this.state.workSchedule.getWorkSchedule().length : "week"
        return (<>
            <PageHeader label={<Message messageKey={"page.employeesWorkSchedule.title"}/>}
                        hasButton={false}
                        buttonOnClick={() => {}}
            />
            <div>
                <div>
                    <ConnectedSelect<EmployeeRecord, EmployeeAppState, EmployeeAppSelectors, EmployeeApplicationStore>
                        controller={this.props.controller}
                        variant={"outlined"}
                        mapProperty={"employeeRecordsById"}
                        selectedItemProperty={"employeeScheduleSelectedEmployee"}
                        itemToString={employee => employee.name!}
                        getKey={employee => employee ? employee.id : 0}
                        label={<Message messageKey={"page.employeesWorkSchedule.employeeSelect"}/>}
                    />
                    <div className={styles.lengthSelect}>
                        {this.getScheduleLengthSelect()}
                    </div>
                    {this.state.showDefaultScheduleCheckBox &&
                    <ConnectedCheckbox<EmployeeAppState>
                        controller={this.props.controller}
                        label={<Message messageKey={"page.clinicsWorkSchedule.userDefaultSchedule.label"}/>}
                        onClick={(checked: boolean) => this.props.controller.employeeScheduleActions.setUsesDefault(checked)}
                        value={this.state.useDefaultWorkSchedule}
                    />
                    }
                    <div className={styles.workScheduleWrapper}>
                        <WorkScheduleTemplate
                            controller={this.props.controller}
                            schedule={schedule}
                            scheduleLength={scheduleLength}
                            disabled={this.state.editingDisabled}
                            disabledTooltipLabel={<Message messageKey={"page.employeesWorkSchedule.defaultWorkSchedule.disable.tooltip.label"}/>}
                            onScheduleChange={(day: number, records: ScheduleRecord[]) => this.props.controller.employeeScheduleActions.setDaySchedule(day, records)}
                        />
                    </div>
                </div>
            </div>
            {/*<DeviationsSection*/}
                {/*disabled={this.state.editingDisabled}*/}
                {/*controller={this.props.controller}*/}
            {/*/>*/}
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            employeeScheduleShowDefaultCheckBox: "showDefaultScheduleCheckBox",
            employeeScheduleDisableEditing: "editingDisabled",
            scheduleForSelectedEmployee: "workSchedule",
            employeeScheduleUsesDefault: "useDefaultWorkSchedule",
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
    workSchedule: EmployeeWorkSchedule | null,
    useDefaultWorkSchedule: boolean,
}