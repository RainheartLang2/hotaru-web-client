import {TooltipProps} from "@material-ui/core";
import * as React from "react";
import Tooltip from "@material-ui/core/Tooltip";

export default class CustomTooltip extends React.Component<Properties> {

    render() {
        return this.props.active
                ? (<Tooltip
                    {...this.props}
                >
                    {this.props.children}
                </Tooltip>
                )
                : this.props.children
    }
}

export type Properties = TooltipProps & {active: boolean}