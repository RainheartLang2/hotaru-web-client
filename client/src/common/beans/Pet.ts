import {Sex} from "./enums/Sex";

export type Pet = {
    id?: number
    name?: string
    breedId?: number
    ownerId: number
    colorId?: number
    birthDate: Date
    petSex?: Sex
    note: string
}