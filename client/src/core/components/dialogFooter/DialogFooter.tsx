import * as React from "react";
import {ButtonComponent} from "../../components";
import {Message} from "../Message";

var styles = require("./styles.css");

export default class DialogFooter extends React.Component<Properties> {
    render() {
        return (
            <>
                <div className={styles.footer}>
                    <div className={styles.footerButton}>
                        <ButtonComponent
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={this.props.submitDisabled}
                            onClick={() => this.props.onSubmitClick()}
                        >
                            <Message messageKey={"common.button.save"}/>
                        </ButtonComponent>
                    </div>
                    <div className={styles.footerButton}>
                        <ButtonComponent
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => this.props.onCancelClick()}>
                            <Message messageKey={"common.button.back"}/>
                        </ButtonComponent>
                    </div>
                </div>
                </>
        )
    }
}

type Properties = {
    submitDisabled: boolean,
    onSubmitClick: () => void,
    onCancelClick: () => void,
}
