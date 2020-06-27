import MessageResource from "../../core/message/MessageResource";
import {PlannedCallStateType} from "../beans/enums/PlannedCallStateType";

export namespace EnumUtils {
    export function stateToString(state: PlannedCallStateType): string {
        switch (state) {
            case PlannedCallStateType.Assigned: return MessageResource.getMessage("plannedCall.state.assigned.name")
            case PlannedCallStateType.Done: return MessageResource.getMessage("plannedCall.state.done.name")
            case PlannedCallStateType.Canceled: return MessageResource.getMessage("plannedCall.state.canceled.name")
            case PlannedCallStateType.Expired: return MessageResource.getMessage("plannedCall.state.expired.name")
        }
    }
}