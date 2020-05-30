import * as React from "react";
import {Link} from "@material-ui/core";

var styles = require("./styles.css");

export default class CustomLink extends React.Component<Properties> {

    static defaultProps = {
        color: "initial",
        onClick: () => {},
        allowedOnClick: () => {},
        disabled: false,
    }

    render() {
        return (
            <div className={styles.linkWrapper}>
                <Link color={this.props.color}
                      onClick={() => {
                          this.props.allowedOnClick()
                          if (!this.props.disabled) {
                              this.props.onClick()
                          }
                      }}
                >
                    {this.props.children}
                </Link>
            </div>
        )
    }

}

type Properties = {
    color?:
        | 'initial'
        | 'inherit'
        | 'primary'
        | 'secondary'
        | 'textPrimary'
        | 'textSecondary'
        | 'error'
    onClick: Function,
    allowedOnClick: Function,
    disabled?: boolean,
}