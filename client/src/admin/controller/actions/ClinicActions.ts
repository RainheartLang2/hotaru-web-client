import AdminAppController from "../AdminAppController";
import EmployeeNode from "../../state/nodes/EmployeeNode";
import ClinicNode from "../../state/nodes/ClinicNode";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {plainToClass} from "class-transformer";
import {Employee} from "../../../common/beans/Employee";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {Clinic} from "../../../common/beans/Clinic";

export default class ClinicActions {
    private controller: AdminAppController
    private node: ClinicNode

    constructor(controller: AdminAppController,
                store: ClinicNode) {
        this.controller = controller
        this.node = store
    }

    public loadClinicList(callback: Function): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllClinics,
            successCallback: result => {
                this.node.setClinicList(plainToClass(Clinic, result) as Clinic[])
                callback()
            },
            loadingProperty: AdminStateProperty.IsPageLoading,
        })
    }
}