import AdminAppController from "../AdminAppController";
import ClinicNode from "../../state/nodes/ClinicNode";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {plainToClass} from "class-transformer";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import {Clinic} from "../../../common/beans/Clinic";
import {DialogType} from "../../state/enum/DialogType";

export default class ClinicActions {
    private controller: AdminAppController
    private node: ClinicNode

    constructor(controller: AdminAppController,
                store: ClinicNode) {
        this.controller = controller
        this.node = store
    }

    public loadClinicList(callback: Function): void {
        // this.controller.cacheManager.clinicCache.execute(callback)
    }

    public openCreateDialog(): void {
        this.controller.batched(() => {
            this.controller.setPropertyValue(AdminStateProperty.EditedClinicId, 0)
            this.controller.setFieldValue(AdminStateProperty.EditedClinicName, "")
            this.controller.toggleFieldValidation(AdminStateProperty.EditedClinicName, false)

            this.controller.setFieldValue(AdminStateProperty.EditedClinicSiteUrl, "")
            this.controller.setFieldValue(AdminStateProperty.EditedClinicCity, "")
            this.controller.setFieldValue(AdminStateProperty.EditedClinicAddress, "")
            this.controller.toggleFieldValidation(AdminStateProperty.EditedClinicAddress, false)
            this.controller.setFieldValue(AdminStateProperty.EditedClinicPhone, "")
            this.controller.setFieldValue(AdminStateProperty.EditedClinicEmail, "")
            this.controller.setPropertyValue(AdminStateProperty.EditedClinicActive, true)

            this.controller.setShowDialog(DialogType.CreateClinic)
        })
    }

    public openEditDialog(clinic: Clinic): void {
        this.controller.batched(() => {
            this.controller.setPropertyValue(AdminStateProperty.EditedClinicId, clinic.id)
            this.controller.setFieldValue(AdminStateProperty.EditedClinicName, clinic.name)
            this.controller.setFieldValue(AdminStateProperty.EditedClinicSiteUrl, clinic.siteUrl)
            this.controller.setFieldValue(AdminStateProperty.EditedClinicCity, clinic.city)
            this.controller.setFieldValue(AdminStateProperty.EditedClinicAddress, clinic.address)
            this.controller.setFieldValue(AdminStateProperty.EditedClinicPhone, clinic.phone)
            this.controller.setFieldValue(AdminStateProperty.EditedClinicEmail, clinic.email)
            this.controller.setPropertyValue(AdminStateProperty.EditedClinicActive, clinic.active)

            this.controller.setShowDialog(DialogType.EditClinic)
        })
    }

    public submitCreateClinic(): void {
        this.controller.setDialogButtonLoading(true)
        const clinic = this.node.buildClinicBasedOnFields()
        fetchUserZoneRpc({
            method: RemoteMethods.addClinic,
            params: [clinic],
            successCallback: (result) => {
                clinic.id = +result
                this.node.addClinic(clinic)
                this.controller.closeCurrentDialog()
                this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }

    public submitEditClinic(): void {
        this.controller.setDialogButtonLoading(true)
        const clinic = this.node.buildClinicBasedOnFields()
        fetchUserZoneRpc({
            method: RemoteMethods.editClinic,
            params: [clinic],
            successCallback: result => {
                this.node.updateClinic(this.node.buildClinicBasedOnFields())
                this.controller.closeCurrentDialog()
                this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }

    public getClinicById(id: number): Clinic {
        return this.node.getClinicById(id)
    }

    public deleteClinic(id: number): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteClinic,
            params: [id],
            successCallback: (result) => this.node.deleteClinic(id),
        })
    }

    public toggleClinicActivity(active: boolean): void {
        this.controller.setPropertyValue(AdminStateProperty.EditedClinicActive, active)
    }
}