import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {EmployeeAppState, EmployeeStateContext} from "../../state/EmployeeApplicationStore";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import EmployeeAppController from "../EmployeeAppController";

export namespace CommonActionsFunctions {
    export function loadList(controller: EmployeeAppController, method: RemoteMethod, resultKey: keyof EmployeeAppState, callback: Function, context?: EmployeeStateContext,
                             parseResponse: (result: any) => any = result => result): void {
        fetchUserZoneRpc({
            method,
            successCallback: result => {
                controller.setState({
                    [resultKey]: parseResponse(result),
                }, context)
                callback(result)
            },
        })
    }
}