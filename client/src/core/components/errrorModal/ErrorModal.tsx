import * as React from "react";
import {DialogContent} from "@material-ui/core";
import ApplicationController from "../../mvc/ApplicationController";
import {GlobalStateProperty} from "../../mvc/store/ApplicationStore";
import {Message} from "../Message";
import Dialog from "@material-ui/core/Dialog";

var styles = require("./styles.css");

export default class ErrorModal extends React.Component<Properties, State> {
    constructor(props: Properties) {
        super(props)
        this.state = {
            errorTextKey: null,
        }
    }

    render() {
        return (
            <>
                <Dialog
                    open={this.state[StateProperty.ErrorTextKey] !== null}
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <DialogContent>
                        <div className={styles.content}>
                            {(this.state[StateProperty.ErrorTextKey])
                                ? (<Message messageKey={this.state[StateProperty.ErrorTextKey] as string}/>)
                                : ''}
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(GlobalStateProperty.ApplicationError, this, StateProperty.ErrorTextKey)
    }
}

enum StateProperty {
    ErrorTextKey = "errorTextKey"
}

type Properties = {
    controller: ApplicationController,
}

type State = {
    errorTextKey: string | null,
}