export class AppointmentInfo {
    title?: string
    startDate: Date
    endDate: Date
    allDay?: boolean

    constructor(title: string, startDate: Date, endDate: Date, allDay: boolean) {
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.allDay = allDay;
    }
}