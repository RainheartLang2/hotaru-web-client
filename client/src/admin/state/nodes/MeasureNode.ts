import Species from "../../../common/beans/Species";
import {Field} from "../../../core/mvc/store/Field";
import Measure from "../../../common/beans/Measure";
import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";

export default class MeasureNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): MeasurePageState {
        return {
            measureList: [],
            editedMeasureId: undefined,
            editedMeasureName: "",
            addedMeasureName: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, MeasurePageSelectors> {
        return {
            measureListById: {
                dependsOn: ["measureList"],
                get: (state: Pick<MeasurePageState, "measureList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.measureList, measure => measure.id ? measure.id : 0),
                value: new Map<number, Species>(),
            },
            addedMeasureNameField: this._store.createField("addedMeasureName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(50),
            ])
        }
    }
}

export type MeasurePageState = {
    measureList: Measure[],
    editedMeasureId: number | undefined,
    editedMeasureName: string,
    addedMeasureName: string,
}

export type MeasurePageSelectors = {
    measureListById: Map<number, Species>,
    addedMeasureNameField: Field,
}