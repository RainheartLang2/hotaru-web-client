import MessageResource from "../message/MessageResource";
import * as React from "react";
import {DEFAULT_LOCALE, LocaleType} from "../enum/LocaleType";

export class Message extends React.Component<MessageProps, MessageState> {

    constructor(props: MessageProps) {
        super(props)
        this.state = {
            locale: DEFAULT_LOCALE
        }
    }

    render() {
        return (<>
            {MessageResource.getMessage(this.props.messageKey, this.state.locale)}
            </>)
    }
}

export type MessageProps = {
    messageKey: string
}

export type MessageState = {
    locale: LocaleType,
}
