import {Employee} from "../../common/beans/Employee";

export namespace NameUtils {
    export function formatName(employee: Employee) {
        return employee.lastName + " " + employee.firstName + (employee.middleName ? (" " + employee.middleName) : "")
    }
}