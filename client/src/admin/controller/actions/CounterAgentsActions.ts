import EmployeeAppController from "../EmployeeAppController";
import CounterAgent, {CounterAgentBean} from "../../../common/beans/CounterAgent";
import {EmployeeStateContext} from "../../state/EmployeeApplicationStore";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {DialogType} from "../../state/enum/DialogType";
import {PersonType} from "../../../common/beans/enums/PersonType";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class CounterAgentsActions {
    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public openCreateDialog(callback: Function = () => {}): void {
        this.controller.openDialog(DialogType.CreateCounterAgent, setPageLoad => {
            this.controller.setState({
                editedAgentId: null,
                editedAgentName: "",
                editedAgentPersonName: "",
                editedAgentType: PersonType.getDefaultType(),
                editedAgentPhone: "",
                editedAgentEmail: "",
                editedAgentPersonFinancialId: "",
                editedAgentBankId: "",
                editedAgentCorAccount: "",
                editedAgentGyroAccount: "",
                editedAgentBankName: "",
                editedAgentNote: "",
            })
            this.controller.toggleFieldValidation("editedAgentNameField", false)
            this.controller.toggleFieldValidation("editedAgentPersonNameField", false)
            setPageLoad()
            callback()
        })
    }

    public openEditDialog(agent: CounterAgent, callback: Function = () => {}): void {
        this.controller.openDialog(DialogType.EditCounterAgent, setPageLoad => {
            this.controller.setState({
                editedAgentId: agent.id,
                editedAgentName: agent.name,
                editedAgentPersonName: agent.contactPersonName,
                editedAgentType: agent.personType,
                editedAgentPhone: agent.phone,
                editedAgentEmail: agent.email,
                editedAgentPersonFinancialId: agent.personFinancialId,
                editedAgentBankId: agent.bankId,
                editedAgentCorAccount: agent.correspondentAccount,
                editedAgentGyroAccount: agent.gyroAccount,
                editedAgentBankName: agent.bankName,
                editedAgentNote: agent.note,
            })
            setPageLoad()
            callback()
        })
    }

    public loadList(callback: Function = () => {}, context?: EmployeeStateContext): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllCounterAgents,
            params: [],
            successCallback: result => {
                const agents = result as CounterAgentBean[]
                this.controller.setState({
                    counterAgentsList: agents.map(bean => new CounterAgent(bean))
                })
            }
        })
    }

    public delete(id: number) {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteCounterAgent,
            params: [id],
            successCallback: result => {
                this.controller.setState({
                    counterAgentsList: this.controller.state.counterAgentsList.filter(agent => agent.id != id)
                })
            }
        })
    }

    public buildAgentByFields(): CounterAgent {
        const state = this.controller.state
        return new CounterAgent({
            id: state.editedAgentId ? state.editedAgentId : undefined,
            name: state.editedAgentNameField.value,
            contactPersonName: state.editedAgentPersonNameField.value,
            personType: state.editedAgentType,
            phone: state.editedAgentPhoneField.value,
            email: state.editedAgentEmailField.value,
            personFinancialId: state.editedAgentPersonFinancialIdField.value,
            bankId: state.editedAgentBankIdField.value,
            bankName: state.editedAgentBankNameField.value,
            correspondentAccount: state.editedAgentCorAccountField.value,
            gyroAccount: state.editedAgentGyroAccountField.value,
            note: state.editedAgentNoteField.value,
        })
    }

    public submitCreate(callback: Function = () => {}): void {
        const agent = this.buildAgentByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.addCounterAgent,
            params: [agent],
            successCallback: result => {
                agent.id = +result
                this.controller.setState({
                    counterAgentsList: [...this.controller.state.counterAgentsList, agent]
                })
                this.controller.closeCurrentDialog()
            }
        })
    }

    public submitEdit(callback: Function = () => {}): void {
        const agent = this.buildAgentByFields()
        fetchUserZoneRpc({
            method: RemoteMethods.editCounterAgent,
            params: [agent],
            successCallback: result => {
                this.controller.setState({
                    counterAgentsList: CollectionUtils.updateIdentifiableArray(this.controller.state.counterAgentsList, agent)
                })
                this.controller.closeCurrentDialog()
            }
        })
    }
}