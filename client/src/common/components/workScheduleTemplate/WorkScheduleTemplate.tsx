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
import {ScheduleRecord} from "../../beans/ScheduleRecord";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

var styles = require("./styles.css");

export default class WorkScheduleTemplate extends React.Component<Properties> {

    private scheduleRangeArray: number[]
    private popovers: CustomPopover[] = []

    static defaultProps = {
        disabled: false,
        tooltipLabel: "",
    }

    constructor(props: Properties) {
        super(props)
        this.scheduleRangeArray = []
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

    private getCustomRangeTitleRow(): ReactNode {
        return (<tr>
            {this.scheduleRangeArray.map((value: number) => {
                return (
                    <td className={styles.titleCell}>
                        {value + 1}
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

    private getDayScheduleCell(day: number): ReactNode {
        const daySchedule = this.props.schedule.getSchedule(day)
        let dayScheduleContentCmp: DayScheduleContent | null = null

        const closePopover = () => {
            if (dayScheduleContentCmp) {
                this.props.onScheduleChange(
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
            {days.map(day => this.getDayScheduleCell(day))}
        </tr>)
    }

    private getCustomRangeRow(): ReactNode {
        return <tr>
            {this.scheduleRangeArray.map(day => this.getDayScheduleCell(day))}
        </tr>
    }

    render() {
        this.scheduleRangeArray = this.props.scheduleLength == "week"
            ? []
            : CollectionUtils.getSimpleNumberArray(this.props.scheduleLength)

        return (<div className={styles.workScheduleTemplate}>
            <table className={styles.workScheduleTemplateTable}>
                <DisablingMoire
                    tooltipLabel={this.props.disabledTooltipLabel}
                    active={this.props.disabled}
                />
                {this.props.scheduleLength == "week" ? this.getWeeklyTitleRow() : this.getCustomRangeTitleRow()}
                {this.props.scheduleLength == "week" ? this.getWeeklyRow() : this.getCustomRangeRow()}
            </table>
        </div>)
    }
}

type Properties = {
    controller: EmployeeAppController,
    scheduleLength: "week" | number,
    disabled: boolean,
    disabledTooltipLabel: NonNullable<React.ReactNode>,
    schedule: WorkSchedule,
    onScheduleChange: (day: number, records: ScheduleRecord[]) => void
}