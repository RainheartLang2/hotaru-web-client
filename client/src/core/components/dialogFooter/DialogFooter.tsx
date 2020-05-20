import * as React from "react";
import {Message} from "../Message";
import ApplicationController from "../../mvc/ApplicationController";
import CustomButton from "../customButton/CustomButton";
import EmployeeAppController from "../../../admin/controller/EmployeeAppController";
import {DefaultStateType} from "../../mvc/store/TypedApplicationStore";
import TypedApplicationStore from "../../mvc/store/TypedApplicationStore";
import TypedCustomButton from "../customButton/TypedCustomButton";
import TypedApplicationController from "../../mvc/controllers/TypedApplicationController";

var styles = require("./styles.css");

export default class DialogFooter<StateType extends DefaultStateType,
                                  SelectorsType,
                                  StoreType extends TypedApplicationStore<StateType, SelectorsType>>
    extends React.Component<Properties<StateType, SelectorsType, StoreType>> {
    render() {
        return (
            <>
                <div className={styles.footer}>
                    <div className={styles.footerButton}>
                        <TypedCustomButton<StateType, SelectorsType, StoreType>
                            controller={this.props.controller}
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={this.props.submitDisabled}
                            onClick={() => this.props.onSubmitClick()}
                            loadingProperty={"isDialogSubmitButtonLoading"}
                        >
                            <Message messageKey={"common.button.save"}/>
                        </TypedCustomButton>
                    </div>
                    <div className={styles.footerButton}>
                        <TypedCustomButton<StateType, SelectorsType, StoreType>
                            controller={this.props.controller}
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => this.props.onCancelClick()}
                        >
                            <Message messageKey={"common.button.back"}/>
                        </TypedCustomButton>
                    </div>
                </div>
            </>
        )
    }
}

type Properties<StateType extends DefaultStateType, SelectorsType, StoreType extends TypedApplicationStore<StateType, SelectorsType>> = {
    controller: TypedApplicationController<StateType, SelectorsType, StoreType>,
    submitDisabled: boolean,
    onSubmitClick: () => void,
    onCancelClick: () => void,
}
