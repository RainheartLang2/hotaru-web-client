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
import CustomButton from "../../../core/components/customButton/CustomButton";
import ApplicationController from "../../../core/mvc/controllers/ApplicationController";

var styles = require("./styles.css")

export default class DayScheduleContent extends React.Component<Properties, State> {

    private addedStartTime: string
    private addedEndTime: string

    static defaultProps = {
        getRef: () => {},
    }

    constructor(props: Properties) {
        super(props)

        this.addedStartTime = ""
        this.addedEndTime = ""

        this.state = {
            records: props.schedule.getRecords(),
            additionDisabled: true,
            recordsValid: true,
        }
    }

    private validateRecords(): boolean {
        let valid = true
        this.state.records.forEach(record => {
            if (!record.getStartTime() || !record.getEndTime() || record.getStartTime()!.greaterThan(record.getEndTime()!)) {
                valid = false
            }
        })
        return valid
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

    private isAddedTimeRangeValid(): boolean {
        const startTime = DateUtils.parseTime(this.addedStartTime)
        const endTime = DateUtils.parseTime(this.addedEndTime)
        if (!startTime || !endTime) {
            return false
        }

        return startTime.lessThan(endTime)
    }

    private validateAddedTimeRange(): void {
        this.setState({
            additionDisabled: !this.isAddedTimeRangeValid()
        })
    }

    private addRecord(): void {
        if (this.isAddedTimeRangeValid()) {
            const startTime = DateUtils.parseTime(this.addedStartTime)
            const endTime = DateUtils.parseTime(this.addedEndTime)
            this.setState({records: [...this.state.records, new ScheduleRecord(startTime!, endTime!)]})
        }
    }

    public getRecords(): ScheduleRecord[] {
        return this.state.records
    }

    render() {
        const error = this.props.externalError || !this.validateRecords()
        return (
            <div className={styles.dayScheduleContent}>
                <div>
                    <div className={this.props.labelStyle ? this.props.labelStyle : styles.label}>
                        {this.props.label}
                    </div>
                    {this.state.records.map((record, index) => {
                        return (
                            <div className={styles.recordWrapper}>
                                <DateRangeComponent
                                    startTime={record.getStartTime()}
                                    endTime={record.getEndTime()}
                                    onStartTimeChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        this.replaceRecord(index,
                                            new ScheduleRecord(DateUtils.parseTime(event.target.value),
                                                record.getEndTime()))
                                    }}
                                    onEndTimeChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        this.replaceRecord(index,
                                            new ScheduleRecord(record.getStartTime(),
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
                            onStartTimeChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.addedStartTime = event.target.value
                                this.validateAddedTimeRange()
                            }}
                            onEndTimeChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                this.addedEndTime = event.target.value
                                this.validateAddedTimeRange()
                            }}
                        />
                        <div className={styles.action}>
                            <CustomContentButton
                                onClick={() => this.addRecord()}
                                tooltipContent={<Message messageKey={"daySchedule.content.add.tooltip"}/>}
                                disabled={this.state.additionDisabled}
                            >
                                <AddIcon color={"inherit"} fontSize={"small"}/>
                            </CustomContentButton>
                        </div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <CustomButton
                        controller={this.props.controller}
                        disabled={error}
                        onClick={() => this.props.onConfirmClick(this.state.records)}
                    >
                        <Message messageKey={"common.button.save"}/>
                    </CustomButton>
                </div>
            </div>
        )
    }

    componentDidMount(): void {
        this.props.getRef(this)
    }
}

type Properties = {
    controller: ApplicationController,
    schedule: DaySchedule,
    labelStyle?: string,
    label?: ReactNode,
    externalError?: boolean,
    getRef: (content: DayScheduleContent) => void,
    onConfirmClick: (records: ScheduleRecord[]) => void,
}

type State = {
    records: ScheduleRecord[],
    additionDisabled: boolean,
    recordsValid: boolean,
}