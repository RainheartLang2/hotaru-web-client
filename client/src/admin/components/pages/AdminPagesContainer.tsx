import * as React from "react";
import AdminAppController from "../../controller/AdminAppController";
import {PageType} from "../../state/enum/PageType";
import UserListPage from "../userlist/UserListPage";
import ClinicsPage from "./clinics/ClinicsPage";
import {AdminStateProperty} from "../../state/AdminApplicationState";
import LoadingMoire from "../../../core/components/loadingMoire/LoadingMoire";
import SchedulePage from "./schedule/SchedulePage";
import SpeciesPage from "./species/SpeciesPage";
import BreedsPage from "./breeds/BreedsPage";

export default class AdminPagesContainer extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.CurrentPage]: PageType.None,
            [StateProperty.IsLoading]: false,
        }
    }

    render() {
        console.log("rendering")
        console.log(this.state[StateProperty.IsLoading])
        const currentPage = this.state[StateProperty.CurrentPage]
        return (<>
            <LoadingMoire delay={true} visible={this.state[StateProperty.IsLoading]}/>
            {currentPage == PageType.UserList && (<UserListPage/>)}
            {currentPage == PageType.ClinicList && (<ClinicsPage controller={this.props.controller}/>)}
            {currentPage == PageType.Schedule && (<SchedulePage controller={this.props.controller}/>)}
            {currentPage == PageType.Species && (<SpeciesPage controller={this.props.controller}/>)}
            {currentPage == PageType.Breeds && (<BreedsPage controller={this.props.controller}/>)}
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.PageType, this, StateProperty.CurrentPage)
        this.props.controller.subscribe(AdminStateProperty.IsPageLoading, this, StateProperty.IsLoading)
    }
}

enum StateProperty {
    CurrentPage = "currentPage",
    IsLoading = "isLoading",
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.CurrentPage]: PageType,
    [StateProperty.IsLoading]: boolean,
}