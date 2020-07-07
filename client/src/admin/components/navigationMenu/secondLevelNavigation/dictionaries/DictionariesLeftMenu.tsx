import * as React from "react";
import EmployeeAppController from "../../../../controller/EmployeeAppController";
import LeftMenu, {LeftMenuEntry} from "../../../../../core/components/leftMenu/LeftMenu";
import {DictionaryMenuItemType} from "../../../../state/enum/DictionaryMenuItemType";
import {Message} from "../../../../../core/components/Message";

export default class DictionariesLeftMenu extends React.Component<Properties> {
    private entries: LeftMenuEntry[]

    constructor(props: Properties) {
        super(props)

        this.entries = [
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
                key: DictionaryMenuItemType.GoodsProducers,
                label: <Message messageKey={"second.navigation.dictionaries.goodsProducer.label"}/>,
                onClick: () => this.props.controller.openGoodsProducerPage(),
            },
            {
                key: DictionaryMenuItemType.VisitPurpose,
                label: <Message messageKey={"second.navigation.dictionaries.visitPurpose.label"}/>,
                onClick: () => this.props.controller.openVisitPurposePage()
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
            {
                key: DictionaryMenuItemType.AnimalColors,
                label: <Message messageKey={"second.navigation.dictionaries.animalColor.label"}/>,
                onClick: () => this.props.controller.openAnimalColorsPage(),
            },
        ]
    }
    render() {
        return (
            <LeftMenu entries={this.entries} selectedEntryKey={this.props.selectedEntryKey}/>
        )
    }
}

export type Properties = {
    controller: EmployeeAppController
    selectedEntryKey: number | null
}
