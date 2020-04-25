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
        this.controller.setPropertyValue(AdminStateProperty.EditedClinicId, 0)
        this.controller.setFieldValue(AdminStateProperty.EditedClinicName, "")
        this.controller.toggleFieldValidation(AdminStateProperty.EditedClinicName, false)

        this.controller.setFieldValue(AdminStateProperty.EditedClinicSiteUrl, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClinicCity, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClinicAddress, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClinicPhone, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClinicEmail, "")
        this.controller.setFieldValue(AdminStateProperty.EditedClinicActive, true)

        this.controller.setShowDialog(DialogType.CreateClinic)
    }

    public submitCreateClinic(): void {
        const clinic = this.node.buildClinicBasedOnFields()
        fetchUserZoneRpc({
            method: RemoteMethods.addClinic,
            params: [clinic],
            successCallback: (result) => {
                clinic.id = +result
                this.node.addClinic(clinic)
                this.controller.closeCurrentDialog()
            },
        })
    }

    public deleteClinic(id: number): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteClinic,
            params: [id],
            successCallback: (result) => this.node.deleteClinic(id),
        })
    }
}