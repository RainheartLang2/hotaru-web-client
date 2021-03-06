import * as React from "react";
import {DialogContent} from "@material-ui/core";
import {Message} from "../Message";
import Dialog from "@material-ui/core/Dialog";
import ApplicationController from "../../mvc/controllers/ApplicationController";

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
                    open={this.state.errorTextKey !== null}
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <DialogContent>
                        <div className={styles.content}>
                            {(this.state.errorTextKey)
                                ? (<Message messageKey={this.state.errorTextKey as string}/>)
                                : ''}
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, {
            globalErrorTextKey: "errorTextKey",
        })
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties = {
    controller: ApplicationController,
}

type State = {
    errorTextKey: string | null,
}