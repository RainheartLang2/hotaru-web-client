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
                <div
                    onClick={(event) => {
                        this.setState({anchor:event.currentTarget})
                    }}
                >
                    {this.props.children}
                </div>
                {!this.props.disabled && (
                    <Popover
                        open={open}
                        anchorEl={this.state.anchor}
                        onClose={() => this.innerClose()}
                        anchorOrigin={this.props.anchorOrigin}
                        transformOrigin={this.props.transformOrigin}
                        keepMounted
                    >
                        <div className={styles.popover}>
                            {this.props.popoverContent}
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
    popoverContent: ReactNode,
    getRef: (popover: CustomPopover) => void,
    disabled?: boolean,
    anchorOrigin?: PopoverOrigin,
    transformOrigin?: PopoverOrigin,
    onClose: Function,
}

type State = {
    popupCouldBeOpen: boolean
    anchor: Element | null
}