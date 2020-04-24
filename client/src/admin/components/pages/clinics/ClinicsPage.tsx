import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";

export default class ClinicsPage extends React.Component {
    render() {
        return (<>
            <PageHeader label={(<Message messageKey={"page.clinics.title"}/>)}
                        hasButton={true}
                        buttonOnClick={() => {}}/>
        </>)
    }
}