import EmployeeAppController from "../../../controller/EmployeeAppController";
import CounterAgent from "../../../../common/beans/CounterAgent";
import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";

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