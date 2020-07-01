export enum PersonalScheduleAppointmentType {
    Visit = "Visit",
    Call = "Call",
}

export namespace PersonalScheduleAppointmentType {
    export function buildIdData(data: AppointmentIdentifyingData): string {
        return data.type + "|" + data.id
    }

    export function extractIdData(value: string): AppointmentIdentifyingData {
        const splittedData = value.split("|")

        return {
            id: +splittedData[1],
            type: splittedData[0] as PersonalScheduleAppointmentType,
        }
    }
}

export type AppointmentIdentifyingData = {
    id: number,
    type: PersonalScheduleAppointmentType,
}
