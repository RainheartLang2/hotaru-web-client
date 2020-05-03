import CrudNode from "../../../core/mvc/crud/CrudNode";
import {Appointment} from "../../../common/beans/Appointment";
import AdminApplicationState, {AdminStateProperty} from "../AdminApplicationState";

export default class AppointmentNode extends CrudNode<Appointment> {
    buildBasedOnFields(): Appointment {
        return {};
    }

    protected getListPropertyName(): string {
        return AdminStateProperty.AppointmentsList;
    }

    protected getMapByIdPropertyName(): string {
        return AdminStateProperty.AppointmentsListById;
    }
}