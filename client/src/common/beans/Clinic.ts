import MessageResource from "../../core/message/MessageResource";

export class Clinic {
    id?: number
    name?: string
    active?: boolean
    phone?: string
    email?: string
    siteUrl?: string
    city?: string
    address?: string

    private static MOCK: Clinic | null = null

    public static getMock(): Clinic {
        if (!this.MOCK) {
            this.MOCK = {
                id: 0,
                name: MessageResource.getMessage("clinic.mock.name"),
                active: true,
            }
        }
        return this.MOCK
    }
}