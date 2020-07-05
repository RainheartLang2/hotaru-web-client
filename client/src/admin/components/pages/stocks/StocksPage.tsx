import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";

export default class StocksPage extends React.Component<Properties, State> {
    render() {
        return (
            <>
                <PageHeader label={(<Message messageKey={"page.stocks.title"}/>)}
                            hasButton={true}
                            buttonOnClick={() => {}}/>
            </>
        )
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {

}