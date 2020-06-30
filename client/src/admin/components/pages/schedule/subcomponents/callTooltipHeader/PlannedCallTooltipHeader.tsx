import * as React from "react";
import {AppointmentTooltip} from "@devexpress/dx-react-scheduler-material-ui";
import CustomContentButton from "../../../../../../core/components/iconButton/CustomContentButton";
import EmployeeAppController from "../../../../../controller/EmployeeAppController";
import {AppointmentInfo} from "../../../../../../common/beans/AppointmentInfo";
import {PersonalScheduleAppointmentType} from "../../../../../../common/beans/enums/PersonalScheduleAppointmentType";
import {Message} from "../../../../../../core/components/Message";
import {PlannedCallStateType} from "../../../../../../common/beans/enums/PlannedCallStateType";
import EditIcon from '@material-ui/icons/EditSharp';
import DoneIcon from '@material-ui/icons/DoneSharp';
import CancelIcon from '@material-ui/icons/DeleteSharp'
import CloseIcon from '@material-ui/icons/CloseSharp'

var styles = require("../../styles.css")

export namespace PlannedCallTooltipHeader {
    export function getComponent(controller: EmployeeAppController): React.ComponentType<AppointmentTooltip.HeaderProps> {
        return class extends React.Component<AppointmentTooltip.HeaderProps> {
            render() {
                const appointmentInfo = this.props.appointmentData as AppointmentInfo
                const id = PersonalScheduleAppointmentType.extractIdData(appointmentInfo.id as string)
                const plannedCall = controller.plannedCallActions.getPlannedCall(id.id)
                return (
                    <div className={styles.appointmentTooltipHeader}>
                        <div className={styles.appointmentTooltipButtons}>
                            <CustomContentButton
                                onClick={() => controller.plannedCallActions.openEditForm(plannedCall)}
                                tooltipContent={<Message messageKey={"plannedCall.edit.tooltip"}/>}
                            >
                                <EditIcon/>
                            </CustomContentButton>
                            {(plannedCall.state == PlannedCallStateType.Assigned || plannedCall.state == PlannedCallStateType.Expired) &&
                                <CustomContentButton
                                    onClick={() => controller.plannedCallActions.markCallDone(plannedCall)}
                                    tooltipContent={<Message messageKey={"plannedCall.state.done.tooltip"}/>}
                                >
                                    <DoneIcon/>
                                </CustomContentButton>
                            }
                            {plannedCall.state == PlannedCallStateType.Assigned &&
                                <CustomContentButton
                                    onClick={() => controller.plannedCallActions.cancelCall(plannedCall)}
                                    tooltipContent={<Message messageKey={"plannedCall.state.cancel.tooltip"}/>}
                                >
                                    <CancelIcon/>
                                </CustomContentButton>
                            }
                        </div>
                    </div>
                )
            }
        }
    }
}