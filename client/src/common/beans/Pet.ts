import {Sex} from "./enums/Sex";

export type Pet = {
    id?: number
    name?: string
    speciesId?: number
    breedId?: number
    ownerId: number
    colorId?: number
    birthDate: Date | null
    petSex?: Sex | null
    note: string
}