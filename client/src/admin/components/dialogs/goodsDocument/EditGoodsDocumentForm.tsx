import * as React from "react";
import EmployeeAppController from "../../../controller/EmployeeAppController";
import {ConfigureType} from "../../../../core/types/ConfigureType";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {Message} from "../../../../core/components/Message";
import {ShipingType} from "../../../../common/beans/enums/ShipingType";

var styles = require("../../../commonStyles.css")

export default class EditGoodsDocumentForm extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            mode: "none",
            hasErrors: false,
            type: ShipingType.Income,
        }
    }

    render() {
        return (
            <>
                <DialogTitle>
                    Создание приходной накладной
                </DialogTitle>
                <DialogContent>
                    <div className={styles.dialogContent}>
                    </div>
                </DialogContent>
            </>
        )
    }
}

type Properties = {
    controller: EmployeeAppController
}

type State = {
    type: ShipingType,
    mode: ConfigureType,
    hasErrors: boolean
}