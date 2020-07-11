import * as React from "react";
import {DefaultStateType} from "../../mvc/store/ApplicationStore";
import ApplicationStore from "../../mvc/store/ApplicationStore";
import ApplicationController from "../../mvc/controllers/ApplicationController";
import {Message} from "../Message";
import CustomButton from "../customButton/CustomButton";
import CancelIcon from "@material-ui/icons/CancelPresentationSharp";
import SaveIcon from "@material-ui/icons/SaveSharp"
import ExecuteIcon from "@material-ui/icons/CheckSharp"

var styles = require("./styles.css");

export default class DocumentDialogFooter<StateType extends DefaultStateType,
    SelectorsType,
    StoreType extends ApplicationStore<StateType, SelectorsType>>
    extends React.Component<Properties<StateType, SelectorsType, StoreType>> {

    render() {
        return (
            <>
                <div className={styles.footer}>
                    {this.props.showExecuteButton &&
                        <div className={styles.footerButton}>
                            <CustomButton<StateType, SelectorsType, StoreType>
                                controller={this.props.controller}
                                variant="contained"
                                color="primary"
                                size="small"
                                disabled={this.props.submitDisabled}
                                onClick={() => this.props.onExecuteClick()}
                                icon={<ExecuteIcon/>}
                            >
                                <Message messageKey={"common.button.executeDocument"}/>
                            </CustomButton>
                        </div>
                    }
                    <div className={styles.footerButton}>
                        {this.props.showCancelButton &&
                            <CustomButton<StateType, SelectorsType, StoreType>
                                controller={this.props.controller}
                                variant="contained"
                                color="primary"
                                size="small"
                                disabled={this.props.submitDisabled}
                                onClick={() => this.props.onCancelClick()}
                                icon={<CancelIcon/>}
                            >
                                <Message messageKey={"common.button.cancel"}/>
                            </CustomButton>
                        }
                    </div>
                    {this.props.showSaveButton &&
                        <div className={styles.footerButton}>
                            <CustomButton<StateType, SelectorsType, StoreType>
                                controller={this.props.controller}
                                variant="contained"
                                color="primary"
                                size="small"
                                disabled={this.props.submitDisabled}
                                onClick={() => this.props.onSubmitClick()}
                                loadingProperty={"isDialogSubmitButtonLoading"}
                                icon={<SaveIcon/>}
                            >
                                <Message messageKey={"common.button.save"}/>
                            </CustomButton>
                        </div>
                    }
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
    showSaveButton: boolean,
    showExecuteButton: boolean,
    showCancelButton: boolean,
    onSubmitClick: () => void,
    onExecuteClick: () => void,
    onCancelClick: () => void,
    onBackClick: () => void,
}