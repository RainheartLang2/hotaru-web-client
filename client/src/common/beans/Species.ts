import Identifiable from "../../core/entities/Identifiable";
import MessageResource from "../../core/message/MessageResource";

export default class Species extends Identifiable {
    name?: string

    private static Mock: Species

    public static getMock(): Species {
        if (!this.Mock) {
            this.Mock = {
                id: 0,
                name: MessageResource.getMessage("species.mock.name")
            }
        }
        return this.Mock
    }
}