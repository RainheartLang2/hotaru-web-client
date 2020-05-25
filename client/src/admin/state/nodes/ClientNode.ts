import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {Client} from "../../../common/beans/Client";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {ClientType} from "../../../common/beans/enums/ClientType";
import {ConfigureDialogType} from "../../../core/types/ConfigureDialogType";
import {DialogType} from "../enum/DialogType";
import {Field} from "../../../core/mvc/store/Field";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import DigitsOnlyValidator from "../../../core/mvc/validators/DigitsOnlyValidator";
import EmailFormatValidator from "../../../core/mvc/validators/EmailFormatValidator";

export default class ClientNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): ClientState {
        return {
            clientsList: [],
            editedClientId: 0,
            editedClientName: "",
            editedClientPhone: "",
            editedClientAddress: "",
            editedClientMail: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, ClientSelectors> {
        return {
            clientsListById: {
                dependsOn: ["clientsList"],
                get: (state: Pick<ClientState, "clientsList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.clientsList, client => client.id ? client.id : 0),
                value: new Map<number, Client>(),
            },
            permanentClients: {
                dependsOn: ["clientsList"],
                get: (state: Pick<ClientState, "clientsList">) => state.clientsList.filter(client => client.type == ClientType.Permanent),
                value: [],
            },
            clientDialogType: {
                dependsOn: ["dialogType"],
                get: (state: Pick<EmployeeAppState, "dialogType">) => {
                    switch (state.dialogType) {
                        case DialogType.CreateClient:
                            return "create"
                        case DialogType.EditClient:
                            return "edit"
                        default:
                            return "none"
                    }
                },
                value: "none",
            },
            editedClientNameField: this._store.createField("editedClientName", "", [new MaximalLengthValidator(100)]),
            editedClientPhoneField: this._store.createField("editedClientPhone", "",
                [new MaximalLengthValidator(15),
                    new DigitsOnlyValidator("\\*")]
            ),
            editedClientAddressField: this._store.createField("editedClientAddress", "", [new MaximalLengthValidator(1024)]),
            editedClientMailField: this._store.createField("editedClientMail", "",
                [
                    new MaximalLengthValidator(254),
                    new EmailFormatValidator(),
                ]
            ),
        }
    }
}

export type ClientState = {
    clientsList: Client[],
    editedClientId: number,
    editedClientName: string,
    editedClientPhone: string,
    editedClientAddress: string,
    editedClientMail: string,
}

export type ClientSelectors = {
    clientsListById: Map<number, Client>,
    permanentClients: Client[],
    clientDialogType: ConfigureDialogType,
    editedClientNameField: Field,
    editedClientPhoneField: Field,
    editedClientAddressField: Field,
    editedClientMailField: Field,
}