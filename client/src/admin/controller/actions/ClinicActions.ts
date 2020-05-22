import EmployeeAppController from "../EmployeeAppController";
import {Clinic} from "../../../common/beans/Clinic";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {DialogType} from "../../state/enum/DialogType";

export default class ClinicActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadClinicList(callback: Function): void {
        this.controller.cacheManager.clinicCache.execute(callback)
    }

    public openCreateDialog(): void {
        this.controller.setState({
            dialogType: DialogType.CreateClinic,
            editedClinicId: 0,
            editedClinicName: "",
            editedClinicSiteUrl: "",
            editedClinicCity: "",
            editedClinicAddress: "",
            editedClinicPhone: "",
            editedClinicEmail: "",
            editedClinicActive: true,
        })
        this.controller.toggleFieldValidation("editedClinicAddressField", false)
        this.controller.toggleFieldValidation("editedClinicNameField", false)
    }

    public openEditDialog(clinic: Clinic): void {
        this.controller.setState({
            dialogType: DialogType.EditClinic,
            editedClinicId: clinic.id,
            editedClinicName: clinic.name,
            editedClinicSiteUrl: clinic.siteUrl,
            editedClinicCity: clinic.city,
            editedClinicAddress: clinic.address,
            editedClinicPhone: clinic.phone,
            editedClinicEmail: clinic.email,
            editedClinicActive: clinic.active,
        })
    }

    private buildClinicByFields(): Clinic {
        const state = this.controller.state
        return {
            id: state.editedClinicId,
            name: state.editedClinicNameField.value,
            siteUrl: state.editedClinicSiteUrlField.value,
            city: state.editedClinicCityField.value,
            address: state.editedClinicAddressField.value,
            phone: state.editedClinicPhoneField.value,
            email: state.editedClinicEmailField.value,
            active: state.editedClinicActive,
        }
    }

    public submitCreateClinic(): void {
        this.controller.setDialogButtonLoading(true)
        const clinic = this.buildClinicByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.addClinic,
            params: [clinic],
            successCallback: (result) => {
                clinic.id = +result
                this.controller.setState({
                    clinicList: [...this.controller.state.clinicList, clinic]
                })
                this.controller.closeCurrentDialog()
                this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }

    public submitEditClinic(): void {
        this.controller.setDialogButtonLoading(true)
        const clinic = this.buildClinicByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.editClinic,
            params: [clinic],
            successCallback: result => {
                this.controller.setState({
                    clinicList: CollectionUtils.updateArray(this.controller.state.clinicList, clinic, clinic => clinic.id)
                })
                this.controller.closeCurrentDialog()
                this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }

    public getClinicById(id: number): Clinic {
        const result = this.controller.state.clinicListById.get(id)
        if (!result) {
            throw new Error("clinic with id " + id + " not exists")
        }
        return result
    }

    public deleteClinic(id: number): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteClinic,
            params: [id],
            successCallback: (result) => this.controller.setState({
                clinicList: this.controller.state.clinicList.filter(clinic => clinic.id != id)
            }),
        })
    }

    public toggleClinicActivity(active: boolean): void {
        this.controller.setState({editedClinicActive: active})
    }
}