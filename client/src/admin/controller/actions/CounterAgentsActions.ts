import EmployeeAppController from "../EmployeeAppController";
import CounterAgent, {CounterAgentBean} from "../../../common/beans/CounterAgent";
import {EmployeeStateContext} from "../../state/EmployeeApplicationStore";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {DialogType} from "../../state/enum/DialogType";
import {PersonType} from "../../../common/beans/enums/PersonType";

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

    public submitCreate(callback: Function = () => {}): void {

    }

    public submitEdit(callback: Function = () => {}): void {

    }
}