import Identifiable from "../../core/entities/Identifiable";
import MessageResource from "../../core/message/MessageResource";

export default class Species extends Identifiable {
    name?: string

    public static getMock(): Species {
        return {
            id: 0,
            name: MessageResource.getMessage("species.mock.name")
        }
    }
}