export class AppointmentInfo {
    id?: string
    title?: string
    startDate: Date
    endDate: Date
    allDay?: boolean

    constructor(id: string, title: string, startDate: Date, endDate: Date, allDay: boolean) {
        this.id = id
        this.title = title
        this.startDate = startDate
        this.endDate = endDate
        this.allDay = allDay
    }
}