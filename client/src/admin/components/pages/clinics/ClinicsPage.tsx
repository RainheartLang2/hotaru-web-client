import * as React from "react";
import {Message} from "../../../../core/components/Message";
import PageHeader from "../../../../common/components/pageHeader/PageHeader";
import {TableBodyCmp, TableCmp, TableHeaderCmp, TableRowCmp} from "../../../../core/components";
import CustomTableCell from "../../../../core/components/tableCell/CustomTableCell";
import {Clinic} from "../../../../common/beans/Clinic";
import AdminAppController from "../../../controller/AdminAppController";
import {AdminStateProperty} from "../../../state/AdminApplicationState";
import ActivityCell from "../../../../core/components/activityCell/ActivityCell";
import {Link} from "@material-ui/core";
import ClinicActions from "../../../controller/actions/ClinicActions";

var styles = require("./styles.css")

export default class ClinicsPage extends React.Component<Properties, State> {

    private actions: ClinicActions
    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.Clinics]: [],
        }
        this.actions = this.props.controller.clinicActions
    }

    private delete(clinicId?: number): void {
        if (clinicId) {
            this.actions.deleteClinic(clinicId)
        } else {
            throw new Error("clinic has no id")
        }
    }

    render() {
        return (<>
            <PageHeader label={(<Message messageKey={"page.clinics.title"}/>)}
                        hasButton={true}
                        buttonOnClick={() => this.actions.openCreateDialog()}/>
            <TableCmp>
                <TableHeaderCmp>
                    <TableRowCmp>
                        <CustomTableCell style={styles.nameCell}>
                            <Message messageKey={"page.clinics.name.title"}/>
                        </CustomTableCell>
                        <CustomTableCell style={styles.urlCell}/>
                        <CustomTableCell style={styles.addressCell}/>
                        <CustomTableCell style={styles.activeCell}/>
                        <CustomTableCell style={styles.actionCell}>
                            <Message messageKey={"common.label.actions"}/>
                        </CustomTableCell>
                    </TableRowCmp>
                </TableHeaderCmp>
                <TableBodyCmp>
                    {this.state[StateProperty.Clinics].map(clinic => {
                        return (
                            <TableRowCmp key={clinic.id}>
                                <CustomTableCell style={styles.nameCell}>
                                    <Link
                                        color="primary"
                                        onClick={() => this.actions.openEditDialog(clinic)}
                                    >
                                        {clinic.name}
                                    </Link>
                                </CustomTableCell>
                                <CustomTableCell style={styles.urlCell}>
                                    <Link
                                        color="primary"
                                        href={clinic.siteUrl}
                                    >
                                        {clinic.siteUrl}
                                    </Link>
                                </CustomTableCell>
                                <CustomTableCell style={styles.addressCell}>
                                    {clinic.address}
                                </CustomTableCell>
                                <CustomTableCell style={styles.activeCell}>
                                    <ActivityCell isActive={clinic.active}/>
                                </CustomTableCell>
                                <CustomTableCell style={styles.actionCell}>
                                    <Link
                                        color="primary"
                                        onClick={() => this.delete(clinic.id)}
                                    >
                                        <Message messageKey={"common.button.delete"}/>
                                    </Link>
                                </CustomTableCell>
                            </TableRowCmp>
                        )
                    })}
                </TableBodyCmp>
            </TableCmp>
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.ClinicList, this, StateProperty.Clinics)
    }
}

enum StateProperty {
    Clinics = "clinics"
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.Clinics]: Clinic[]
}