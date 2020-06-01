import * as React from "react";
import {PageType} from "../../state/enum/PageType";
import UserListPage from "../userlist/UserListPage";
import ClinicsPage from "./clinics/ClinicsPage";
import LoadingMoire from "../../../core/components/loadingMoire/LoadingMoire";
import SchedulePage from "./schedule/SchedulePage";
import SpeciesPage from "./species/SpeciesPage";
import BreedsPage from "./breeds/BreedsPage";
import EmployeeAppController from "../../controller/EmployeeAppController";
import ClientsPage from "./clients/ClientsPage";
import MeasurePage from "./measure/MeasurePage";
import VisitResultPage from "./visitResult/VisitResultPage";
import DiagnosisPage from "./diagnosis/DiagnosisPage";
import VisitPurposePage from "./visitPurpose/VisitPurposePage";
import AnimalColorPage from "./animalColor/AnimalColorPage";
import ClinicsWorkschedulePage from "./clinicsWorkschedule/ClinicsWorkschedulePage";

export default class AdminPagesContainer extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            currentPage: PageType.None,
            isLoading: false,
        }
    }

    private isRenderPage(pageType: PageType) {
        return !this.state.isLoading && this.state.currentPage == pageType
    }

    render() {
        const isLoading = this.state.isLoading
        return (<>
            <LoadingMoire delay={true} visible={isLoading}/>
            {this.isRenderPage(PageType.UserList) && (<UserListPage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.ClinicList) && (<ClinicsPage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.Schedule) && (<SchedulePage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.Species) && (<SpeciesPage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.Breeds) && (<BreedsPage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.Clients) && <ClientsPage controller={this.props.controller}/>}
            {this.isRenderPage(PageType.MeasureUnits) && (<MeasurePage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.VisitResult) && (<VisitResultPage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.VisitPurpose) && (<VisitPurposePage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.Diagnosis) && (<DiagnosisPage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.AnimalColors) && (<AnimalColorPage controller={this.props.controller}/>)}
            {this.isRenderPage(PageType.ClinicsWorkschedule) && (<ClinicsWorkschedulePage controller={this.props.controller}/>)}
        </>)
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            pageType: "currentPage",
            isPageLoading: "isLoading",
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
    currentPage: PageType,
    isLoading: boolean,
}