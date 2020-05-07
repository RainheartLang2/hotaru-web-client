import Identifiable from "../../core/entities/Identifiable";
import MessageResource from "../../core/message/MessageResource";

export default class Breed extends Identifiable {
    name?: string
    speciesId?: number

    private static MOCK: Breed | null = null

    public static getMock(): Breed {
        if (!this.MOCK) {
            this.MOCK = {
                id: 0,
                name: MessageResource.getMessage("breed.mock.name")
            }
        }
        return this.MOCK
    }
}