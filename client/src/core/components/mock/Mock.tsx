import * as React from "react";

export default class Mock extends React.Component {
    render() {
        return (<>
            {this.props.children}
        </>)
    }
}