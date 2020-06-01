import * as React from "react";
import {Tab, Tabs} from "@material-ui/core";
import {DictionaryMenuItemType} from "../../../state/enum/DictionaryMenuItemType";
import {Message} from "../../../../core/components/Message";
import EmployeeAppController from "../../../controller/EmployeeAppController";

export default class DictionariesNavigationMenu extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            selectedItem: DictionaryMenuItemType.None
        }
    }

    render() {
        return (
            <Tabs
                variant="fullWidth"
                value={this.state.selectedItem}
                indicatorColor={"secondary"}
                textColor={"primary"}
            >
                <Tab
                    label={<Message messageKey={"second.navigation.dictionaries.species.label"}/>}
                    value={DictionaryMenuItemType.Species}
                    onClick={() => this.props.controller.openSpeciesPage()}
                />
                <Tab
                    label={<Message messageKey={"second.navigation.dictionaries.breed.label"}/>}
                    value={DictionaryMenuItemType.Breed}
                    onClick={() => this.props.controller.openBreedsPage()}
                />
            </Tabs>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            secondLevelNavigationSelectedItem: "selectedItem",
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
    selectedItem: DictionaryMenuItemType
}