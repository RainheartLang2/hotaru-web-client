import * as React from "react";
import {Message} from "../Message";
import ApplicationController from "../../mvc/ApplicationController";
import CustomButton from "../customButton/CustomButton";

var styles = require("./styles.css");

export default class DialogFooter extends React.Component<Properties> {
    render() {
        return (
            <>
                <div className={styles.footer}>
                    <div className={styles.footerButton}>
                        <CustomButton
                            controller={this.props.controller}
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={this.props.submitDisabled}
                            onClick={() => this.props.onSubmitClick()}
                            loadingProperty={this.props.controller.getDialogSubmitButtonPropertyName()}
                        >
                            <Message messageKey={"common.button.save"}/>
                        </CustomButton>
                    </div>
                    <div className={styles.footerButton}>
                        <CustomButton
                            controller={this.props.controller}
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => this.props.onCancelClick()}
                        >
                            <Message messageKey={"common.button.back"}/>
                        </CustomButton>
                    </div>
                </div>
            </>
        )
    }
}

type Properties = {
    controller: ApplicationController,
    submitDisabled: boolean,
    onSubmitClick: () => void,
    onCancelClick: () => void,
}
