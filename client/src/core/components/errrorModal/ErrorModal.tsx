import * as React from "react";
import {DialogContent} from "@material-ui/core";
import ApplicationController from "../../mvc/ApplicationController";
import {GLOBAL_APPLICATION_ERROR} from "../../mvc/ApplicationStore";
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
                    open={this.state[ERROR_TEXT_KEY] !== null}
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <DialogContent>
                        <div className={styles.content}>
                            {(this.state[ERROR_TEXT_KEY])
                                ? (<Message messageKey={this.state[ERROR_TEXT_KEY] as string}/>)
                                : ''}
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(GLOBAL_APPLICATION_ERROR, this, ERROR_TEXT_KEY)
    }
}

type Properties = {
    controller: ApplicationController,
}

type State = {
    errorTextKey: string | null,
}

const ERROR_TEXT_KEY = "errorTextKey"