import * as React from "react";
import {ChangeEvent, ReactNode} from "react";
import {DaySchedule} from "../../beans/DaySchedule";
import {TextField, Tooltip} from "@material-ui/core";
import ControlledCheckBox from "../../../core/components/controlledCheckBox/ControlledCheckBox";
import DayScheduleContent from "../dayScheduleContent/DayScheduleContent";
import ApplicationController from "../../../core/mvc/controllers/ApplicationController";
import {DateUtils} from "../../../core/utils/DateUtils";
import {ScheduleRecord} from "../../beans/ScheduleRecord";
import DeleteIcon from '@material-ui/icons/DeleteSharp';
import {Message} from "../../../core/components/Message";
import CustomContentButton from "../../../core/components/iconButton/CustomContentButton";
import standardFormatDate = DateUtils.standardFormatDate;

var styles = require("./styles.css")

export default class DeviationDayScheduleContent extends React.Component<Properties, State> {

    private name: string
    private startDate: Date
    private endDate: Date

    constructor(props: Properties) {
        super(props)
        this.state = {
            global: this.props.global,
            error: true,
        }
        this.name = this.props.name
        this.startDate = this.props.startDate
        this.endDate = this.props.endDate
    }

    private areFieldsValid(): boolean {
        return DateUtils.isDateValid(this.startDate)
            && DateUtils.isDateValid(this.endDate)
            && this.startDate <= this.endDate
            && !!this.name
            && this.name.length < 50
    }

    private onConfirmClickHandle(records: ScheduleRecord[]): void {
        this.props.onConfirmClick(this.name,
            this.state.global,
            this.startDate,
            this.endDate,
            records)
    }

    private validate(): void {
        this.setState({
            error: !this.areFieldsValid()
        })
    }

    render() {
        const error = this.state.error
        const deviationContent = (
            <>
                <div className={styles.header}>
                    <div className={styles.label}>
                        {this.props.label}
                    </div>
                    <div className={styles.headerButtonPanel}>
                        {this.props.onDeleteClick && <CustomContentButton
                            onClick={() => this.props.onDeleteClick!()}
                            tooltipContent={<Message messageKey={"dayScheduleDeviation.content.delete.tooltip"}/>}
                        >
                            <DeleteIcon color={"inherit"} fontSize={"small"}/>
                        </CustomContentButton>}
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.nameField}>
                        <TextField
                            label={"Название"}
                            defaultValue={this.props.name}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                this.name = event.target.value
                                this.validate()
                            }}
                            size={"small"}
                            fullWidth={true}
                        />
                    </div>
                    <Tooltip
                        arrow={true}
                        title={<Message messageKey={"dayScheduleDeviation.clinic.global.tooltip"}/>}
                    >
                        <div className={styles.globalCheckBox}>

                            <ControlledCheckBox
                                label={<Message messageKey={"dayScheduleDeviation.clinic.global.label"}/>}
                                checked={this.state.global} onChange={(event, checked) => {
                                this.setState({global: checked})
                            }}
                            />
                        </div>
                    </Tooltip>
                    <div className={styles.dateRange}>
                        <div className={styles.dateField}>
                            <TextField
                                defaultValue={standardFormatDate(this.startDate)}
                                type={"date"}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    this.startDate = new Date(event.target.value)
                                    this.validate()
                                }}
                                size={"small"}
                                fullWidth={true}
                            />
                        </div>
                        <div className={styles.dateSeparator}>
                            -
                        </div>
                        <div className={styles.dateField}>
                            <TextField
                                defaultValue={standardFormatDate(this.endDate)}
                                type={"date"}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    this.endDate = new Date(event.target.value)
                                    this.validate()
                                }}
                                size={"small"}
                                fullWidth={true}
                            />
                        </div>
                    </div>
                </div>
            </>
        )

        return (
            <DayScheduleContent
                controller={this.props.controller}
                schedule={this.props.schedule}
                onConfirmClick={(records: ScheduleRecord[]) => this.onConfirmClickHandle(records)}
                label={deviationContent}
                labelStyle={""}
                externalError={error}
            />
        )
    }

    componentDidMount(): void {
        this.validate()
    }
}

export type DeviationDayScheduleConfirmFunction = (name: string, global: boolean, startDate: Date, endDate: Date, records: ScheduleRecord[]) => void

type Properties = {
    controller: ApplicationController,
    label: ReactNode,
    schedule: DaySchedule,
    name: string,
    global: boolean,
    startDate: Date,
    endDate: Date,
    onConfirmClick: DeviationDayScheduleConfirmFunction,
    onDeleteClick?: Function,
}

type State = {
    global: boolean,
    error: boolean,
}