import {ApplicationStoreFriend} from "../../../core/mvc/store/ApplicationStoreFriend";
import {AdminStateProperty} from "../AdminApplicationState";
import {Employee} from "../../../common/beans/Employee";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {Clinic} from "../../../common/beans/Clinic";
import {DialogType} from "../DialogType";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import EmailFormatValidator from "../../../core/mvc/validators/EmailFormatValidator";

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

        this.store.registerProperty(AdminStateProperty.EditedClinicId, 0)
        this.store.registerField(AdminStateProperty.EditedClinicName, "",
            [new RequiredFieldValidator(), new MaximalLengthValidator(200)])

        this.store.registerField(AdminStateProperty.EditedClinicSiteUrl, "",
            [new MaximalLengthValidator(256)])

        this.store.registerField(AdminStateProperty.EditedClinicCity, "")
        this.store.registerField(AdminStateProperty.EditedClinicAddress, "",
            [new RequiredFieldValidator(), new MaximalLengthValidator(1024)])
        this.store.registerProperty(AdminStateProperty.EditedClinicActive, true)
        this.store.registerField(AdminStateProperty.EditedClinicEmail, "",
            [new EmailFormatValidator(), new MaximalLengthValidator(254)])
        this.store.registerField(AdminStateProperty.EditedClinicPhone, "",
            [new MaximalLengthValidator(15)])

        this.store.registerSelector(AdminStateProperty.EditClinicFormHasErrors,
            {
                dependsOn: [AdminStateProperty.EditedClinicName,
                    AdminStateProperty.EditedClinicSiteUrl,
                    AdminStateProperty.EditedClinicCity,
                    AdminStateProperty.EditedClinicEmail,
                    AdminStateProperty.EditedClinicPhone
                ],
                get: (map: Map<string, any>) => {
                    return !this.store.fieldsHaveNoErrors([AdminStateProperty.EditedClinicName,
                        AdminStateProperty.EditedClinicSiteUrl,
                        AdminStateProperty.EditedClinicCity,
                        AdminStateProperty.EditedClinicEmail,
                        AdminStateProperty.EditedClinicPhone
                    ])
                }
            })
    }

    public getClinicList(): Clinic[] {
        return this.store.getPropertyValue(AdminStateProperty.ClinicList)
    }

    public getClinicListById(): Map<number, Clinic> {
        return this.store.getPropertyValue(AdminStateProperty.ClinicList)
    }

    public getClinicById(id: number): Clinic {
        const clinic = this.getClinicListById().get(id)
        if (!clinic) {
            throw new Error("clinic with id " + id + " is not presented in the store")
        }
        return clinic
    }

    public setClinicList(clinicList: Clinic[]) {
        this.store.setPropertyValue(AdminStateProperty.ClinicList, clinicList)
    }

    public addClinic(clinic: Clinic) {
        const clinics = this.getClinicList()
        clinics.push(clinic)
        this.setClinicList(clinics)
    }

    public updateClinic(updatedClinic: Clinic) {
        const clinicList = this.getClinicList().map(clinic => clinic.id == updatedClinic.id ? updatedClinic : clinic)
        this.setClinicList(clinicList)
    }

    public deleteClinic(id: number) {
        const clinics = this.getClinicList().filter(clinic => clinic.id != id)
        this.setClinicList(clinics)
    }

    public buildClinicBasedOnFields(): Clinic {
        return {
            id: this.store.getPropertyValue(AdminStateProperty.EditedClinicId),
            name: this.store.getFieldValue(AdminStateProperty.EditedClinicName),
            siteUrl: this.store.getFieldValue(AdminStateProperty.EditedClinicSiteUrl),
            city: this.store.getFieldValue(AdminStateProperty.EditedClinicCity),
            address: this.store.getFieldValue(AdminStateProperty.EditedClinicAddress),
            active: this.store.getPropertyValue(AdminStateProperty.EditedClinicActive),
            phone: this.store.getFieldValue(AdminStateProperty.EditedClinicPhone),
            email: this.store.getFieldValue(AdminStateProperty.EditedClinicEmail),
        }
    }
}