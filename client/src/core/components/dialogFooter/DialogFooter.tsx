import * as React from "react";
import {Message} from "../Message";
import ApplicationStore, {DefaultStateType} from "../../mvc/store/ApplicationStore";
import CustomButton from "../customButton/CustomButton";
import ApplicationController from "../../mvc/controllers/ApplicationController";

var styles = require("./styles.css");

export default class DialogFooter<StateType extends DefaultStateType,
                                  SelectorsType,
                                  StoreType extends ApplicationStore<StateType, SelectorsType>>
    extends React.Component<Properties<StateType, SelectorsType, StoreType>> {
    render() {
        return (
            <>
                <div className={styles.footer}>
                    <div className={styles.footerButton}>
                        <CustomButton<StateType, SelectorsType, StoreType>
                            controller={this.props.controller}
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={this.props.submitDisabled}
                            onClick={() => this.props.onSubmitClick()}
                            loadingProperty={"isDialogSubmitButtonLoading"}
                        >
                            <Message messageKey={"common.button.save"}/>
                        </CustomButton>
                    </div>
                    <div className={styles.footerButton}>
                        <CustomButton<StateType, SelectorsType, StoreType>
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

type Properties<StateType extends DefaultStateType, SelectorsType, StoreType extends ApplicationStore<StateType, SelectorsType>> = {
    controller: ApplicationController<StateType, SelectorsType, StoreType>,
    submitDisabled: boolean,
    onSubmitClick: () => void,
    onCancelClick: () => void,
}
