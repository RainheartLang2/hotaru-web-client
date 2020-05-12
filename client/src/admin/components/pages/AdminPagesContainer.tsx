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

    private isRenderPage(pageType: PageType) {
        const currentPage = this.state[StateProperty.CurrentPage]
        const isLoading = this.state[StateProperty.IsLoading]
        return !isLoading && currentPage == pageType
    }

    render() {
        const isLoading = this.state[StateProperty.IsLoading]
        return (<>
            <LoadingMoire delay={true} visible={isLoading}/>
            {this.isRenderPage(PageType.UserList) && (<UserListPage/>)}
            {this.isRenderPage(PageType.ClinicList) && (<ClinicsPage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.Schedule) && (<SchedulePage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.Species) && (<SpeciesPage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.Breeds) && (<BreedsPage controller={this.props.controller}/>)}
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.PageType, this, StateProperty.CurrentPage)
        this.props.controller.subscribe(AdminStateProperty.IsPageLoading, this, StateProperty.IsLoading)
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
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