export enum LocaleType {
    Russian = "ru",
}

export namespace LocaleUtils {
    export function getLocaleTag(locale: LocaleType): string {
        switch (locale) {
            case LocaleType.Russian: return "ru-RU"
            default: return "ru-RU"
        }
    }
}
export const DEFAULT_LOCALE = LocaleType.Russian
