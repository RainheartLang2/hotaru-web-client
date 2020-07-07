import EmployeeAppController from "../../../controller/EmployeeAppController";
import CounterAgent from "../../../../common/beans/CounterAgent";
import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {TableBodyCmp, TableCmp, TableRowCmp} from "../../../../core/components";
import {Link} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteSharp"
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import CustomContentButton from "../../../../core/components/iconButton/CustomContentButton";

export default class CounterAgentsPage extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            agents: [],
        }
    }

    render() {
        const actions = this.props.controller.counterAgentActions
        return (
            <>
                <PageHeader label={(<Message messageKey={"page.counterAgent.title"}/>)}
                            hasButton={true}
                            buttonOnClick={() => actions.openCreateDialog()}/>
                <TableCmp>
                    <TableBodyCmp>
                        {this.state.agents.map(agent => {
                            return (
                                <TableRowCmp key={agent.id}>
                                    <CustomTableCell>
                                        <Link
                                            color="primary"
                                            onClick={() => actions.openEditDialog(agent)}
                                        >
                                            {agent.name}
                                        </Link>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {agent.contactPersonName}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {agent.phone}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {agent.email}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <CustomContentButton
                                            onClick={() => {
                                                if (agent.id) {
                                                    actions.delete(agent.id)
                                                }
                                            }}
                                            tooltipContent={<Message messageKey={"common.button.delete"}/>}
                                        >
                                            <DeleteIcon/>
                                        </CustomContentButton>
                                    </CustomTableCell>
                                </TableRowCmp>
                            )
                        })}
                    </TableBodyCmp>
                </TableCmp>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            counterAgentsList: "agents"
        })
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    agents: CounterAgent[],
}