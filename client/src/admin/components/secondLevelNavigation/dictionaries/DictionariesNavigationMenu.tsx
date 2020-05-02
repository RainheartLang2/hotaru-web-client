import * as React from "react";
import {Tab, Tabs} from "@material-ui/core";
import AdminAppController from "../../../controller/AdminAppController";
import {DictionaryMenuItemType} from "../../../state/enum/DictionaryMenuItemType";
import {Message} from "../../../../core/components/Message";
import {NavigationMenuItemType} from "../../../state/enum/NavigationMenuItemType";
import {AdminStateProperty} from "../../../state/AdminApplicationState";

export default class DictionariesNavigationMenu extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)

        this.state = {
            [StateProperty.SelectedItem]: DictionaryMenuItemType.None
        }
    }

    render() {
        return (
            <Tabs
                variant="fullWidth"
                value={this.state[StateProperty.SelectedItem]}
                indicatorColor={"secondary"}
                textColor={"primary"}
            >
                <Tab
                    label={<Message messageKey={"second.navigation.dictionaries.species.label"}/>}
                    value={DictionaryMenuItemType.Species}
                    onClick={() => {}}
                />
                <Tab
                    label={<Message messageKey={"second.navigation.dictionaries.breed.label"}/>}
                    value={DictionaryMenuItemType.Breed}
                    onClick={() => {}}
                />
            </Tabs>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(AdminStateProperty.DictionariesNavigationSelectedItem, this, StateProperty.SelectedItem)
    }
}

enum StateProperty {
    SelectedItem = "selectedItem"
}

type Properties = {
    controller: AdminAppController
}

type State = {
    [StateProperty.SelectedItem]: DictionaryMenuItemType
}