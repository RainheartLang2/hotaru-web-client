import AdminAppController from "../AdminAppController";
import ClinicNode from "../../state/nodes/ClinicNode";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {plainToClass} from "class-transformer";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {Clinic} from "../../../common/beans/Clinic";
import {DialogType} from "../../state/DialogType";

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

    public openCreateDialog(): void {
        this.controller.setShowDialog(DialogType.CreateClinic)
    }

    public deleteClinic(id: number): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteClinic,
            params: [id],
            successCallback: (result) => this.node.deleteClinic(id),
        })
    }
}