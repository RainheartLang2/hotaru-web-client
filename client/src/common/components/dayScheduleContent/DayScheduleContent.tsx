import * as React from "react";
import {DaySchedule} from "../../beans/DaySchedule";
import {ReactNode} from "react";
import DateRangeComponent from "../../../core/components/dateRangeComponent/DateRangeComponent";
import CustomContentButton from "../../../core/components/iconButton/CustomContentButton";
import {Message} from "../../../core/components/Message";
import DeleteIcon from '@material-ui/icons/DeleteSharp';
import AddIcon from '@material-ui/icons/AddSharp';
import {ScheduleRecord} from "../../beans/ScheduleRecord";
import {DateUtils} from "../../../core/utils/DateUtils";

var styles = require("./styles.css")

export default class DayScheduleContent extends React.Component<Properties, State> {

    private addedStartTime: string
    private addedEndTime: string

    constructor(props: Properties) {
        super(props)

        this.addedStartTime = ""
        this.addedEndTime = ""

        this.state = {
            records: props.schedule.records
        }
    }

    private replaceRecord(index: number, record: ScheduleRecord): void {
        const records = this.state.records
        records[index] = record
        this.setState({records})
    }

    private deleteRecord(ind: number): void {
        this.setState({
            records: this.state.records.filter((record, index) => index != ind)
        })
    }

    private addRecord(): void {
        if (DateUtils.isTimeValid(this.addedEndTime) && DateUtils.isTimeValid(this.addedStartTime)) {
            const startTime = DateUtils.parseTime(this.addedStartTime)
            const endTime = DateUtils.parseTime(this.addedEndTime)
            this.setState({records: [...this.state.records, new ScheduleRecord(startTime, endTime)]})
        }
    }

    render() {
        return (
            <div className={styles.dayScheduleContent}>
                <div className={styles.label}>
                    {this.props.label}
                </div>
                {this.state.records.map((record, index) => {
                    return (
                        <div className={styles.recordWrapper}>
                            <DateRangeComponent
                                startTime={record.startTime}
                                endTime={record.endTime}
                                onStartTimeChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    this.replaceRecord(index,
                                        new ScheduleRecord(DateUtils.parseTime(event.target.value),
                                            record.endTime))
                                }}
                                onEndTimeChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    this.replaceRecord(index,
                                        new ScheduleRecord(record.startTime,
                                            DateUtils.parseTime(event.target.value)))
                                }}
                            />
                            <div className={styles.action}>
                                <CustomContentButton
                                    onClick={() => this.deleteRecord(index)}
                                    tooltipContent={<Message messageKey={"daySchedule.content.delete.tooltip"}/>}>
                                    <DeleteIcon color={"inherit"} fontSize={"small"}/>
                                </CustomContentButton>
                            </div>
                        </div>
                    )
                })}
                <div className={styles.recordWrapper}>
                    <DateRangeComponent
                        onStartTimeChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            this.addedStartTime = event.target.value
                        }
                        onEndTimeChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            this.addedEndTime = event.target.value
                        }
                    />
                    <div className={styles.action}>
                        <CustomContentButton
                            onClick={() => this.addRecord()}
                            tooltipContent={<Message messageKey={"daySchedule.content.add.tooltip"}/>}>
                            <AddIcon color={"inherit"} fontSize={"small"}/>
                        </CustomContentButton>
                    </div>
                </div>

            </div>
        )
    }
}
type Properties = {
    schedule: DaySchedule,
    label: ReactNode,
}

type State = {
    records: ScheduleRecord[],
}