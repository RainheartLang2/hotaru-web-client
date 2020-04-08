import {LocaleType} from "../enum/LocaleType";
import {ApplicationType} from "../enum/ApplicationType";

const messages = require("./messages.json")

export default class MessageResource {

    public static getMessage(locale: LocaleType, application: ApplicationType, messageKey: string): string {
        const resultMessage = messages[locale][application][messageKey]
        if (!resultMessage) {
            throw new Error(`no message for key ${locale}.${application}.${messageKey}`)
        }
        return resultMessage
    }
}