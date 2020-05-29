import * as React from "react";
import {Popover} from "@material-ui/core";
import {ReactNode} from "react";

var styles = require("./styles.css");

export default class CustomPopover extends React.Component<Properties, State> {

    static defaultProps = {
        getRef: (popover: CustomPopover) => {}
    }

    constructor(props: Properties) {
        super(props)
        this.state = {
            anchor: null,
            popupCouldBeOpen: true,
        }
    }

    public close(): void {
        this.setState({anchor: null})
    }

    render() {
        return (
            <div>
                <div
                    onClick={(event) => {
                        this.setState({anchor:event.currentTarget})
                    }}
                >
                    {this.props.children}
                </div>
                <Popover
                    open={!!this.state.anchor}
                    anchorEl={this.state.anchor}
                    onClose={() => this.close()}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    keepMounted
                >

                    {this.props.popoverContent}
                </Popover>
            </div>
        )
    }

    componentDidMount(): void {
        this.props.getRef(this)
    }
}

type Properties = {
    popoverContent: ReactNode,
    getRef: (popover: CustomPopover) => void,
}

type State = {
    popupCouldBeOpen: boolean
    anchor: Element | null
}