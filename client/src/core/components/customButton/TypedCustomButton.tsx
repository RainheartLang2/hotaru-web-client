import * as React from "react";
import {ButtonComponent} from "../../components";
import {CircularProgress, PropTypes} from "@material-ui/core";
import {MouseEventHandler} from "react";
import TypedApplicationStore from "../../mvc/store/TypedApplicationStore";
import TypedApplicationController from "../../mvc/controllers/TypedApplicationController";

var styles = require("./styles.css");

export default class TypedCustomButton<GlobalState, DerivationType, StoreType extends TypedApplicationStore<GlobalState, DerivationType>>
    extends React.Component<Properties<GlobalState, DerivationType, StoreType>, State> {

    constructor(props: Properties<GlobalState, DerivationType, StoreType>) {
        super(props)
        this.state = {
            isLoading: false,
        }
    }

    isLoading(): boolean {
        return !!this.props.loadingProperty && this.state.isLoading
    }

    render() {
        return (<ButtonComponent
            disabled={this.props.disabled}
            onClick={(this.props.onClick && !this.isLoading()) ? this.props.onClick : () => {}}
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
            this.props.controller.subscribe(this, this.props.loadingProperty, "isLoading")
        }
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties<GlobalState, DerivationType, StoreType extends TypedApplicationStore<GlobalState, DerivationType>> = {
    controller: TypedApplicationController<GlobalState, DerivationType, StoreType>
    color?: PropTypes.Color
    disabled?: boolean
    onClick?: MouseEventHandler
    fullWidth?: boolean
    size?: 'small' | 'medium' | 'large'
    variant?: 'text' | 'outlined' | 'contained'
    loadingProperty?: keyof(GlobalState & DerivationType)
}

type State = {
    isLoading: false
}