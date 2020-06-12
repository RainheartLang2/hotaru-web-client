import * as React from "react";
import {Popover, PopoverOrigin} from "@material-ui/core";
import {ReactNode} from "react";

var styles = require("./styles.css");

export default class CustomPopover extends React.Component<Properties, State> {

    static defaultProps = {
        getRef: (popover: CustomPopover) => {},
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
        },
        disabled: false,
        onClose: () => {},
        className: "",
    }

    constructor(props: Properties) {
        super(props)
        this.state = {
            anchor: null,
            popupCouldBeOpen: true,
        }
    }

    public close(): void {
        this.innerClose()
    }

    private innerClose(): void {
        this.setState({anchor: null})
    }

    render() {
        const open = this.state.anchor ? true : false
        return (
            <>
                <div className={this.props.className}
                    onClick={(event) => {
                        this.setState({anchor:event.currentTarget})
                    }}
                >
                    {this.props.children}
                </div>
                {!this.props.disabled && open && (
                    <Popover
                        open={true}
                        anchorEl={this.state.anchor}
                        onClose={() => this.innerClose()}
                        anchorOrigin={this.props.anchorOrigin}
                        transformOrigin={this.props.transformOrigin}
                    >
                        <div className={styles.popover}>
                            {this.props.popoverContent()}
                        </div>
                    </Popover>)
                }
            </>
        )
    }

    componentDidMount(): void {
        this.props.getRef(this)
    }
}

type Properties = {
    popoverContent: () => ReactNode,
    getRef: (popover: CustomPopover) => void,
    disabled: boolean,
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    onClose: Function,
    className: string,
}

type State = {
    popupCouldBeOpen: boolean
    anchor: Element | null
}