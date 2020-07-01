import EmployeeAppController from "../EmployeeAppController";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {Client} from "../../../common/beans/Client";
import {Pet} from "../../../common/beans/Pet";
import {DialogType} from "../../state/enum/DialogType";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {ClientType} from "../../../common/beans/enums/ClientType";

export default class ClientActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public loadList(params: any[] = [], callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllClients,
            params: params,
            successCallback: result => {
                this.controller.setState({
                    clientsList: result
                })
                callback(result)
            },
        })
    }

    public loadClientsWithPets(clientsIds: number[], callback: Function) {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllClients,
            params: clientsIds,
            successCallback: result => {
                const clientInfo: ServerClientInfo = result
                this.controller.setState({
                    clientsList: clientInfo.clients,
                    petList: clientInfo.pets,
                })
                callback(result)
            },
        })
    }

    public loadPermanentClientsWithPets(callback: Function) {
        fetchUserZoneRpc({
            method: RemoteMethods.getPermanentClients,
            successCallback: result => {
                const clientInfo: ServerClientInfo = result
                    this.controller.setState({
                        clientsList: clientInfo.clients,
                        petList: clientInfo.pets,
                    })
                callback(result)
            },
        })
    }

    public openCreateDialog(): void {
        this.controller.setState({
            dialogType: DialogType.CreateClient,
            editedClientId: 0,
            editedClientName: "",
            editedClientPhone: "",
            editedClientAddress: "",
            editedClientMail: "",
        })
        this.controller.toggleFieldValidation("editedClientNameField", false)
        this.controller.toggleFieldValidation("editedClientPhoneField", false)
    }

    public openEditDialog(client: Client): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getPetsForClient,
            params: [client.id!],
            successCallback: result => {
                this.controller.setState({
                    dialogType: DialogType.EditClient,
                    petList: result,
                    editedClientId: client.id,
                    editedClientName: client.firstName,
                    editedClientPhone: client.phone,
                    editedClientAddress: client.address,
                    editedClientMail: client.email,
                })
                this.controller.toggleFieldValidation("editedClientNameField", false)
                this.controller.toggleFieldValidation("editedClientPhoneField", false)
            }
        })
    }

    public buildClientByFields(type: ClientType = ClientType.Permanent): Client {
        const state = this.controller.state
        return {
            id: state.editedClientId,
            type: ClientType.Permanent,
            firstName: state.editedClientNameField.value,
            phone: state.editedClientPhoneField.value,
            email: state.editedClientMailField.value,
            address: state.editedClientAddressField.value,
        }
    }

    public addClient(client: Client): void {
        this.controller.setState({
            clientsList: [...this.controller.state.clientsList, client],
        })
    }

    public submitCreateClient(): void {
        this.controller.setDialogButtonLoading(true)
        const client = this.buildClientByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.addClient,
            params: [client],
            successCallback: (result) => {
                client.id = +result
                this.controller.setState({
                    clientsList: [...this.controller.state.clientsList, client]
                })
                this.controller.closeCurrentDialog()
                this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }

    public submitEditClient(): void {
        this.controller.setDialogButtonLoading(true)
        const client = this.buildClientByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.editClient,
            params: [client],
            successCallback: result => {
                this.controller.setState({
                    clinicList: CollectionUtils.updateArray(this.controller.state.clientsList, client, client => client.id)
                })
                this.controller.closeCurrentDialog()
                this.controller.setDialogButtonLoading(false)
            },
            errorCallback: () => this.controller.setDialogButtonLoading(false)
        })
    }
}

type ServerClientInfo = {
    clients: Client[],
    pets: Pet[],
}