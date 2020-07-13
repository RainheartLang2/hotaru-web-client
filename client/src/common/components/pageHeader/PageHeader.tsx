import * as React from "react";
import {ButtonComponent} from "../../../core/components";
import {Message} from "../../../core/components/Message";
import {ReactNode} from "react";

var styles = require("./styles.css");

export default class PageHeader extends React.Component<Properties> {

    static defaultProps = {
        hasButton: false,
        buttonOnClick: () => {},
        wrapAddButton: (addButton: ReactNode) => addButton,
    }

    private getAddButton(): ReactNode {
        return (
            <ButtonComponent
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                    this.props.buttonOnClick()
                }}>
                <Message messageKey={"common.button.create"}/>
            </ButtonComponent>
        )
    }

    render() {
        return (
            <div className={styles.pageHeader}>
                <div className={styles.label}>
                    {this.props.label}
                </div>
                {this.props.hasButton &&
                    this.props.wrapAddButton(this.getAddButton())
                }
            </div>
        )
    }
}

type Properties = {
    label: string | React.ReactNode,
    hasButton: boolean,
    buttonOnClick: Function,
    wrapAddButton: (addButton: ReactNode) => ReactNode,
}
