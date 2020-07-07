import MessageResource from "../../../core/message/MessageResource";

export enum PersonType {
    Natural = "Natural",
    Legal = "Legal",
}

export namespace PersonType {
    export function personTypeToString(personType: PersonType): string {
        if (personType == PersonType.Legal) {
            return MessageResource.getMessage("personType.legal.name")
        } else if (personType == PersonType.Natural) {
            return MessageResource.getMessage("personType.natural.name")
        } else {
            throw new Error("no name for person type " + personType)
        }
    }

    export function getDefaultType(): PersonType {
        return PersonType.Legal
    }

    export function personTypeToNumber(personType: PersonType): number {
        if (personType == PersonType.Legal) {
            return 1
        } else if (personType == PersonType.Natural) {
            return 2
        } else {
            throw new Error("no number for person type " + personType)
        }
    }
}