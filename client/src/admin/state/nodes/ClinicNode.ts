import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";
import {AdminStateProperty} from "../AdminApplicationState";
import {Employee} from "../../../common/beans/Employee";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {Clinic} from "../../../common/beans/Clinic";
import {DialogType} from "../DialogType";

export default class ClinicNode {
    private store: ApplicationStoreFriend

    constructor(store: ApplicationStoreFriend) {
        this.store = store

        this.store.registerProperty(AdminStateProperty.ClinicList, [])
        this.store.registerSelector(AdminStateProperty.ClinicListById, {
            dependsOn: [AdminStateProperty.ClinicList],
            get: map => {
                const clinicList: Employee[] = map.get(AdminStateProperty.ClinicList) as Clinic[]
                return CollectionUtils.mapArrayByPredicate(clinicList, clinic => clinic.id)
            }
        })

        this.store.registerSelector(AdminStateProperty.ClinicDialogType, {
            dependsOn: [AdminStateProperty.DialogType],
            get: map => {
                const globalDialogType: DialogType = map.get(AdminStateProperty.DialogType)
                switch (globalDialogType) {
                    case DialogType.CreateClinic:
                        return "create"
                    case DialogType.EditClinic:
                        return "edit"
                    default:
                        return "none"
                }
            }
        })
    }

    public getClinicList(): Clinic[] {
        return this.store.getPropertyValue(AdminStateProperty.ClinicList)
    }

    public getClinicListById(): Map<number, Clinic> {
        return this.store.getPropertyValue(AdminStateProperty.ClinicList)
    }

    public setClinicList(clinicList: Clinic[]) {
        this.store.setPropertyValue(AdminStateProperty.ClinicList, clinicList)
    }

    public deleteClinic(id: number) {
        const clinics = this.getClinicList().filter(clinic => clinic.id != id)
        this.setClinicList(clinics)
    }
}