import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {Message} from "../../../../core/components/Message";

var styles = require("./styles.css");

export default class EditPetForm extends React.Component<Properties, State> {
    render() {
        return (
            <div className={styles.content}>
                <div className={styles.title}>
                    <Message messageKey={"panel.pet.title"}/>
                </div>
                <div className={styles.row}>
                </div>
            </div>
        )
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {

}