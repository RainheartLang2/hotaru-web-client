import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";

export default class SchedulePage extends React.Component {
    render() {
        return (<>
            <PageHeader
                label={(<Message messageKey={"page.schedule.title"}/>)}
                hasButton={false}
            />
            </>)
    }
}