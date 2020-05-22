import {Checkbox, FormControlLabel, FormGroup, InputLabel} from "@material-ui/core";
import * as React from "react";
import {ReactNode} from "react";
import {DefaultStateType} from "../../mvc/store/ApplicationStore";
import ApplicationController from "../../mvc/controllers/ApplicationController";
import {CommonUtils} from "../../utils/CommonUtils";

export default class ConnectedCheckbox<ApplicationState extends DefaultStateType>
    extends React.Component<Properties<ApplicationState>, State> {

    constructor(props: Properties<ApplicationState>) {
        super(props)
        this.state = {
            isChecked: false
        }
    }

    render() {
        return (
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.isChecked}
                            onChange={(event) =>
                                this.props.controller.setState({[this.props.propertyName]: event.target.checked})
                            }
                            color="primary"
                        />}
                    label={
                        this.props.label && (
                            <InputLabel>
                                {this.props.label}
                            </InputLabel>
                        )
                    }
                    labelPlacement="end"
                >
                </FormControlLabel>
            </FormGroup>
        )
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, CommonUtils.createLooseObject([[this.props.propertyName, "isChecked"]]))
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties<ApplicationState> = {
    controller: ApplicationController,
    propertyName: keyof ApplicationState,
    label: ReactNode,
}

type State = {
    isChecked: boolean
}