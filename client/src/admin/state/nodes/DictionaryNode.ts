import Species from "../../../common/beans/Species";
import {Field} from "../../../core/mvc/store/Field";
import MeasureUnit from "../../../common/beans/MeasureUnit";
import ApplicationStoreFriend from "../../../core/mvc/store/ApplicationStoreFriend";
import {EmployeeAppSelectors, EmployeeAppState} from "../EmployeeApplicationStore";
import {SelectorsInfo} from "../../../core/mvc/store/ApplicationStore";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import RequiredFieldValidator from "../../../core/mvc/validators/RequiredFieldValidator";
import MaximalLengthValidator from "../../../core/mvc/validators/MaximalLengthValidator";
import VisitResult from "../../../common/beans/VisitResult";

export default class DictionaryNode {
    private _store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>


    constructor(store: ApplicationStoreFriend<EmployeeAppState, EmployeeAppSelectors>) {
        this._store = store;
    }

    public getDefaultState(): DictionariesPagesState {
        return {
            measureList: [],
            editedMeasureId: undefined,
            editedMeasureName: "",
            addedMeasureName: "",

            visitResultsList: [],
            editedVisitResultId: undefined,
            editedVisitResultName: "",
            addedVisitResultName: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, DictionariesPageSelectors> {
        return {
            measureListById: {
                dependsOn: ["measureList"],
                get: (state: Pick<DictionariesPagesState, "measureList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.measureList, measure => measure.id ? measure.id : 0),
                value: new Map<number, MeasureUnit>(),
            },
            addedMeasureNameField: this._store.createField("addedMeasureName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(50),
            ]),
            visitResultListById: {
                dependsOn: ["visitResultsList"],
                get: (state: Pick<DictionariesPagesState, "visitResultsList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.visitResultsList, visitResult => visitResult.id ? visitResult.id : 0),
                value: new Map<number, VisitResult>(),
            },
            addedVisitResultNameField: this._store.createField("addedVisitResultName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(50),
            ])
        }
    }
}

export type DictionariesPagesState = {
    measureList: MeasureUnit[],
    editedMeasureId: number | undefined,
    editedMeasureName: string,
    addedMeasureName: string,

    visitResultsList: VisitResult[],
    editedVisitResultId: number | undefined,
    editedVisitResultName: string,
    addedVisitResultName: string,

}

export type DictionariesPageSelectors = {
    measureListById: Map<number, Species>,
    addedMeasureNameField: Field,

    visitResultListById: Map<number, VisitResult>,
    addedVisitResultNameField: Field,
}