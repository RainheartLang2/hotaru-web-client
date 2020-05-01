import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import * as React from "react";
import {Message} from "../../../../core/components/Message";
import {TableBodyCmp, TableCmp} from "../../../../core/components";

export default class SpeciesPage extends React.Component {
    render() {
        return (
            <>
                <PageHeader
                    label={(<Message messageKey={"page.species.title"}/>)}
                    hasButton={false}
                    buttonOnClick={() => {}}
                />
                <TableCmp>
                    <TableBodyCmp>

                    </TableBodyCmp>
                </TableCmp>
            </>
        )
    }
}