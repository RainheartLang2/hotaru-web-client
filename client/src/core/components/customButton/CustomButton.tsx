import * as React from "react";
import {ButtonComponent} from "../../components";
import {CircularProgress, PropTypes} from "@material-ui/core";
import {MouseEventHandler, ReactNode} from "react";
import ApplicationStore, {DefaultStateType} from "../../mvc/store/ApplicationStore";
import ApplicationController from "../../mvc/controllers/ApplicationController";
import {CommonUtils} from "../../utils/CommonUtils";

var styles = require("./styles.css");

export default class CustomButton<GlobalState extends DefaultStateType, DerivationType, StoreType extends ApplicationStore<GlobalState, DerivationType>>
    extends React.Component<Properties<GlobalState, DerivationType, StoreType>, State> {

    static defaultProps = {
        icon: "",
    }

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
            onClick={(this.props.onClick && !this.isLoading()) ? this.props.onClick : () => {
            }}
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
                <div className={styles.buttonContent}>
                    {!!this.props.icon &&
                        <div className={styles.iconArea}>
                            {this.props.icon}
                        </div>
                    }
                    {this.props.children}
                </div>

            </div>
        </ButtonComponent>)
    }

    componentDidMount(): void {
        if (this.props.loadingProperty && this.props.controller) {
            this.props.controller.subscribe(this, CommonUtils.createLooseObject([[this.props.loadingProperty, "isLoading"]]))
        }
    }

    componentWillUnmount(): void {
        if (this.props.loadingProperty && this.props.controller) {
            this.props.controller.unsubscribe(this)
        }
    }
}

type Properties<GlobalState extends DefaultStateType, DerivationType, StoreType extends ApplicationStore<GlobalState, DerivationType>> = {
    controller?: ApplicationController<GlobalState, DerivationType, StoreType>
    color?: PropTypes.Color
    disabled?: boolean
    onClick?: MouseEventHandler
    fullWidth?: boolean
    size?: 'small' | 'medium' | 'large'
    variant?: 'text' | 'outlined' | 'contained'
    loadingProperty?: keyof (GlobalState & DerivationType)
    icon: ReactNode
}

type State = {
    isLoading: false
}