import * as React from "react";
import {SecondLevelNavigationMenuType} from "../state/enum/SecondLevelNavigationMenuType";
import EmployeeAppController from "../controller/EmployeeAppController";
import DictionariesLeftMenu from "../components/navigationMenu/secondLevelNavigation/dictionaries/DictionariesLeftMenu";
import ClinicsManagementLeftMenu
    from "../components/navigationMenu/secondLevelNavigation/clinics/ClinicsManagementLeftMenu";
import EmployeesManagementLeftMenu
    from "../components/navigationMenu/secondLevelNavigation/employees/EmployeesManagementLeftMenu";

export default class EmployeeLeftMenuContainer extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            menu: SecondLevelNavigationMenuType.None,
            selectedEntryKey: null,
        }
    }

    render() {
        return (
            <div>
                {this.state.menu == SecondLevelNavigationMenuType.Dictionaries
                    && <DictionariesLeftMenu
                            controller={this.props.controller}
                            selectedEntryKey={this.state.selectedEntryKey}
                        />}
                {this.state.menu == SecondLevelNavigationMenuType.ClinicsManagement
                    && <ClinicsManagementLeftMenu
                            controller={this.props.controller}
                            selectedEntryKey={this.state.selectedEntryKey}
                        />}
                {this.state.menu == SecondLevelNavigationMenuType.EmployeesManagement
                    && <EmployeesManagementLeftMenu
                            controller={this.props.controller}
                            selectedEntryKey={this.state.selectedEntryKey}
                        />}
            </div>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            secondLevelNavigationMenuType: "menu",
            secondLevelNavigationSelectedItem: "selectedEntryKey",
        })
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    menu: SecondLevelNavigationMenuType,
    selectedEntryKey: number | null,
}