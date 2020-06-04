import {Checkbox, FormControlLabel, FormGroup, InputLabel} from "@material-ui/core";
import * as React from "react";
import {ReactNode} from "react";
import {DefaultStateType} from "../../mvc/store/ApplicationStore";
import ApplicationController from "../../mvc/controllers/ApplicationController";
import {CommonUtils} from "../../utils/CommonUtils";

export default class ConnectedCheckbox<ApplicationState extends DefaultStateType>
    extends React.Component<Properties<ApplicationState>, State> {

    static defaultProps = {
        onClick: () => {
        }
    }

    constructor(props: Properties<ApplicationState>) {
        super(props)
        this.state = {
            isChecked: false
        }
    }

    render() {
        const checked = this.props.propertyName
            ? this.state.isChecked
            : this.props.value
        return (
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={(event) => {
                                if (this.props.propertyName) {
                                    this.props.controller.setState({[this.props.propertyName]: event.target.checked})
                                }
                                this.props.onClick(event.target.checked)
                            }}
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
        if (this.props.propertyName) {
            this.props.controller.subscribe(this, CommonUtils.createLooseObject([[this.props.propertyName, "isChecked"]]))
        }
    }

    componentWillUnmount(): void {
        if (this.props.propertyName) {
            this.props.controller.unsubscribe(this)
        }
    }
}

type Properties<ApplicationState> = {
    controller: ApplicationController,
    propertyName?: keyof ApplicationState,
    label: ReactNode,
    onClick: (checked: boolean) => void,
    value?: boolean,
}

type State = {
    isChecked: boolean
}