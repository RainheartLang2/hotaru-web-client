import {LocaleType} from "../enum/LocaleType";
import {ApplicationType} from "../enum/ApplicationType";
import LocaleHolder from "../utils/LocaleHolder";
import ApplicationHolder from "../utils/ApplicationHolder";

const messages = require("./messages.json")

export default class MessageResource {

    public static getMessage(
                             messageKey: string,
                             locale: LocaleType = LocaleHolder.instance.localeType,
                             application: ApplicationType = ApplicationHolder.instance.applicationType,
                             args: string[] = []): string {
        let resultMessage = messages[locale][application][messageKey] as string
        if (!resultMessage) {
            resultMessage = messages[locale]["common"][messageKey] as string
            if (!resultMessage) {
                throw new Error(`no message for key ${locale}.${application}.${messageKey}`)
            }
        }
        args.forEach((argumentValue, index) => {
            resultMessage = resultMessage.replace("${" + index + "}", argumentValue)
        })
        return resultMessage
    }
}