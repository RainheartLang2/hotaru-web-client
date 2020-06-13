import * as React from "react";
import {ReactNode} from "react";
import {Message} from "../../../core/components/Message";
import {WeekDay} from "../../beans/enums/WeekDay";
import CustomPopover from "../../../core/components/customPopover/CustomPopover";
import DayScheduleContent from "../dayScheduleContent/DayScheduleContent";
import WorkSchedule from "../../beans/WorkSchedule";
import {DateUtils} from "../../../core/utils/DateUtils";
import {DaySchedule} from "../../beans/DaySchedule";
import EmployeeAppController from "../../../admin/controller/EmployeeAppController";
import DisablingMoire from "../../../core/components/disablingMoire/DisablingMoire";

var styles = require("./styles.css");

export default class WorkScheduleTemplate extends React.Component<Properties> {

    private popovers: CustomPopover[] = []

    static defaultProps = {
        disabled: false,
    }

    private getWeeklyTitleRow(): ReactNode {
        const messageKeys = [
            "common.monday.short",
            "common.tuesday.short",
            "common.wednesday.short",
            "common.thursday.short",
            "common.friday.short",
            "common.saturday.short",
            "common.sunday.short",
        ]
        return (<tr>
            {messageKeys.map((value: string) => {
                return (
                    <td className={styles.titleCell}>
                        <Message messageKey={value}/>
                    </td>
                )
            })}
        </tr>)
    }

    private getDayScheduleCellContent(daySchedule: DaySchedule): ReactNode {
        if (daySchedule.isWholeDayLong()) {
            return (<div>
                <Message messageKey={"common.wholeDayLong"}/>
            </div>)
        }

        return daySchedule.getRecords().map((record, index) => {
            return (
                <div className={styles.timeIntervalRecord}>
                    {DateUtils.formatTimeObject(record.getStartTime()!)}
                    -
                    {DateUtils.formatTimeObject(record.getEndTime()!)}
                    {index != daySchedule.getRecords().length - 1
                        ? "," : ""}
                </div>
            )
        })
    }

    private getWeeklyRow(): ReactNode {
        const days = [
            WeekDay.Monday,
            WeekDay.Tuesday,
            WeekDay.Wednesday,
            WeekDay.Thursday,
            WeekDay.Friday,
            WeekDay.Saturday,
            WeekDay.Sunday,
        ]

        return (<tr>
            {days.map(day => {
                const daySchedule = this.props.schedule.getSchedule(day)
                let dayScheduleContentCmp: DayScheduleContent | null = null

                const closePopover = () => {
                    if (dayScheduleContentCmp) {
                        this.props.controller.clinicsWorkScheduleActions.setDaySchedule(
                            day, dayScheduleContentCmp.getRecords()
                        )
                        this.popovers[day].close()
                    }
                }

                const popoverContent = (
                    <DayScheduleContent
                        controller={this.props.controller}
                        label={<Message messageKey={"second.navigation.clinicsManagement.workSchedule.popover.label"}/>}
                        schedule={daySchedule}
                        getRef={(content: DayScheduleContent) => dayScheduleContentCmp = content}
                        onConfirmClick={closePopover}
                    />
                )

                return (
                    <td
                        className={styles.simpleCell}
                    >
                        <CustomPopover
                            popoverContent={() => popoverContent}
                            getRef={(popover) => {
                                this.popovers[day] = popover
                            }}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "left"
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            disabled={this.props.disabled}
                            onClose={() => {}}
                        >
                            <div className={styles.simpleCellContent}>
                                {this.getDayScheduleCellContent(daySchedule)}
                            </div>
                        </CustomPopover>
                    </td>
                )
            })}
        </tr>)
    }

    render() {
        return (<div className={styles.workScheduleTemplate}>
            <table className={styles.workScheduleTemplateTable}>
                <DisablingMoire
                    tooltipLabel={this.props.disabledTooltipLabel}
                    active={this.props.disabled}
                />
                {this.getWeeklyTitleRow()}
                {this.getWeeklyRow()}
            </table>
        </div>)
    }
}

type Properties = {
    controller: EmployeeAppController,
    scheduleLength: "week" | number,
    disabled: boolean,
    disabledTooltipLabel?: ReactNode,
    schedule: WorkSchedule,
}