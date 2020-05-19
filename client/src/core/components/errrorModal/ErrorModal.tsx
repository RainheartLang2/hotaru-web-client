import * as React from "react";
import {DialogContent} from "@material-ui/core";
import ApplicationController from "../../mvc/ApplicationController";
import {GlobalStateProperty} from "../../mvc/store/ApplicationStore";
import {Message} from "../Message";
import Dialog from "@material-ui/core/Dialog";
import TypedApplicationController from "../../mvc/controllers/TypedApplicationController";

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
        this.props.controller.subscribeBatch(this, [["globalErrorTextKey", "errorTextKey"]])
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties = {
    controller: TypedApplicationController,
}

type State = {
    errorTextKey: string | null,
}