import * as React from "react";
import {ReactNode} from "react";
import {Message} from "../../../core/components/Message";
import {WeekDay} from "../../beans/enums/WeekDay";
import CustomPopover from "../../../core/components/customPopover/CustomPopover";
import DayScheduleContent from "../dayScheduleContent/DayScheduleContent";
import WorkSchedule from "../../beans/WorkSchedule";
import {DateUtils} from "../../../core/utils/DateUtils";
import {DaySchedule} from "../../beans/DaySchedule";

var styles = require("./styles.css");

export default class WorkScheduleTemplate extends React.Component<Properties> {

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

        return daySchedule.records.map((record, index) => {
            return (
                <div className={styles.timeIntervalRecord}>
                    {DateUtils.formatTimeObject(record.startTime)}
                    -
                    {DateUtils.formatTimeObject(record.endTime)}
                    {index != daySchedule.records.length - 1
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
                const popoverContent = (
                    <DayScheduleContent
                        label={<Message messageKey={"second.navigation.clinicsManagement.workSchedule.popover.label"}/>}
                        schedule={daySchedule}
                    />
                )

                return (
                    <td
                        className={this.props.disabled ? styles.disabledSimpleCell : styles.simpleCell}
                    >
                        <CustomPopover
                            popoverContent={popoverContent}
                            getRef={() => {
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
                {this.getWeeklyTitleRow()}
                {this.getWeeklyRow()}
            </table>
        </div>)
    }
}

type Properties = {
    scheduleLength: "week" | number,
    disabled?: boolean,
    schedule: WorkSchedule,
}