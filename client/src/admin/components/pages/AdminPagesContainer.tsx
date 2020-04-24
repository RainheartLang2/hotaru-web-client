import * as React from "react";
import AdminAppController from "../../controller/AdminAppController";
import {PageType} from "../../state/PageType";
import UserListPage from "../userlist/UserListPage";
import ClinicsPage from "./clinics/ClinicsPage";
import {AdminStateProperty} from "../../state/AdminApplicationState";

export default class AdminPagesContainer extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.CurrentPage]: PageType.None,
        }
    }

    render() {
        const currentPage = this.state[StateProperty.CurrentPage]
        return (<>
            {currentPage == PageType.UserList && (<UserListPage/>)}
            {currentPage == PageType.ClinicList && (<ClinicsPage/>)}
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.PageType, this, StateProperty.CurrentPage)
    }
}

enum StateProperty {
    CurrentPage = "currentPage"
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.CurrentPage]: PageType,
}