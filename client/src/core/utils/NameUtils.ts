import {Employee} from "../../common/beans/Employee";
import {Client} from "../../common/beans/Client";
import {Phone} from "@material-ui/icons";
import {PhoneUtils} from "./PhoneUtils";
import {Pet} from "../../common/beans/Pet";
import Species from "../../common/beans/Species";

export namespace NameUtils {
    export function formatName(employee: Employee) {
        return employee.lastName + " " + employee.firstName + (employee.middleName ? (" " + employee.middleName) : "")
    }

    export function formatClientName(client: Client) {
        return (client.lastName ? client.lastName + " " : "")
                + (client.firstName ? client.firstName + " " : "")
                + (client.middleName ? client.middleName + " " : "")
                + (client.phone ? PhoneUtils.formatPhone(client.phone) : "")
    }

    export function formatPetName(pet: Pet, species: Species) {
        return (pet.name ? (pet.name + " ") : "")
            + ("(" + species!.name + ")")
    }
}