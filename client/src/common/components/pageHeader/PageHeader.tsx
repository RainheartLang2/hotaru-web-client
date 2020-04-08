import * as React from "react";
import {ButtonComponent} from "../../../core/components";

var styles = require("./styles.css");

export default class PageHeader extends React.Component<PageHeaderProps> {

    static defaultProps = {
        hasButton: false,
        buttonOnClick: () => {},
    }

    render() {
        return (
            <div className={styles.pageHeader}>
                <div className={styles.label}>
                    {this.props.label}
                </div>
                {this.props.hasButton ? (<ButtonComponent variant="contained"
                                                          color="primary"
                                                          size="small"
                                                          onClick={() => {this.props.buttonOnClick()}}>
                        Создать
                    </ButtonComponent>)
                    : ''}
            </div>
        )
    }
}

export type PageHeaderProps = {
    label: string | React.ReactNode,
    hasButton: boolean,
    buttonOnClick: Function,
}
