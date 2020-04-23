import * as React from "react";
import {ButtonComponent} from "../../components";
import {CircularProgress, PropTypes} from "@material-ui/core";
import {MouseEventHandler} from "react";
import ApplicationController from "../../mvc/ApplicationController";

var styles = require("./styles.css");

export default class CustomButton extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            [StateProperty.IsLoading]: false,
        }
    }

    isLoading(): boolean {
        return !!this.props.loadingProperty && this.state[StateProperty.IsLoading]
    }

    render() {
        return (<ButtonComponent
            disabled={this.props.disabled}
            onClick={this.props.onClick ? this.props.onClick : () => {}}
            color={this.props.color ? this.props.color : "primary"}
            fullWidth={this.props.fullWidth}
            size={this.props.size ? this.props.size : "small"}
            variant={this.props.variant ? this.props.variant : "contained"}
        >
            <div className={styles.loaderWrapper}>
                {this.isLoading()
                    ? (<CircularProgress
                        color="secondary"
                        size={20}
                    />)
                    : ""}
            </div>

            <div className={this.isLoading() ? styles.labelLoading : ""}>
                {this.props.children}
            </div>
        </ButtonComponent>)
    }

    componentDidMount(): void {
        if (this.props.loadingProperty) {
            this.props.controller.subscribe(this.props.loadingProperty, this, StateProperty.IsLoading)
        }
    }
}

enum StateProperty {
    IsLoading = "IsLoading",
}

type Properties = {
    controller: ApplicationController
    color?: PropTypes.Color
    disabled?: boolean
    onClick?: MouseEventHandler
    fullWidth?: boolean
    size?: 'small' | 'medium' | 'large'
    variant?: 'text' | 'outlined' | 'contained'
    loadingProperty?: string
}

type State = {
    [StateProperty.IsLoading]: false
}