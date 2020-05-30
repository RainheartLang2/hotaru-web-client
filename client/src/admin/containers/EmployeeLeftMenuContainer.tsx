import * as React from "react";
import {SecondLevelNavigationMenuType} from "../state/enum/SecondLevelNavigationMenuType";
import EmployeeAppController from "../controller/EmployeeAppController";
import LeftMenu, {LeftMenuEntry} from "../../core/components/leftMenu/LeftMenu";
import {Message} from "../../core/components/Message";
import {DictionaryMenuItemType} from "../state/enum/DictionaryMenuItemType";

export default class EmployeeLeftMenuContainer extends React.Component<Properties, State> {

    private dictionariesMenuEntries: LeftMenuEntry[]

    constructor(props: Properties) {
        super(props)
        this.state = {
            menu: SecondLevelNavigationMenuType.None,
            selectedEntryKey: null,
        }
        this.dictionariesMenuEntries = [
            {
                key: DictionaryMenuItemType.Species,
                label: <Message messageKey={"second.navigation.dictionaries.species.label"}/>,
                onClick: () => this.props.controller.openSpeciesPage(),
            },
            {
                key: DictionaryMenuItemType.Breed,
                label: <Message messageKey={"second.navigation.dictionaries.breed.label"}/>,
                onClick: () => this.props.controller.openBreedsPage(),
            },
            {
                key: DictionaryMenuItemType.MeasureUnits,
                label: <Message messageKey={"second.navigation.dictionaries.measureUnit.label"}/>,
                onClick: () => this.props.controller.openMeasureUnitsPage()
            },
            {
                key: DictionaryMenuItemType.VisitResult,
                label: <Message messageKey={"second.navigation.dictionaries.visitResult.label"}/>,
                onClick: () => this.props.controller.openVisitResultPage()
            },
            {
                key: DictionaryMenuItemType.Diagnosis,
                label: <Message messageKey={"second.navigation.dictionaries.diagnosis.label"}/>,
                onClick: () => this.props.controller.openDiagnosisPage(),
            },
        ]
    }

    render() {
        return (
            <div>
                {this.state.menu == SecondLevelNavigationMenuType.Dictionaries
                    && <LeftMenu
                            selectedEntryKey={this.state.selectedEntryKey}
                            entries={this.dictionariesMenuEntries}
                        />}
            </div>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            secondLevelNavigationMenuType: "menu",
            dictionariesNavigationSelectedItem: "selectedEntryKey",
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