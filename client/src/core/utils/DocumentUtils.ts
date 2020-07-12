import {ShipingType} from "../../common/beans/enums/ShipingType";

export namespace DocumentUtils {
    export function documentTypeHasCounterAgent(documentType: ShipingType) {
        return documentType == ShipingType.Income || documentType == ShipingType.Outcome
    }
}