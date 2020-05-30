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
import Diagnosis from "../../../common/beans/Diagnosis";

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

            diagnosisList: [],
            editedDiagnosisId: undefined,
            editedDiagnosisName: "",
            addedDiagnosisName: "",
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
            ],
                false),
            visitResultListById: {
                dependsOn: ["visitResultsList"],
                get: (state: Pick<DictionariesPagesState, "visitResultsList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.visitResultsList, visitResult => visitResult.id ? visitResult.id : 0),
                value: new Map<number, VisitResult>(),
            },
            addedVisitResultNameField: this._store.createField("addedVisitResultName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(50),
            ],
                false),
            diagnosisById: {
                dependsOn: ["diagnosisList"],
                get: (state: Pick<DictionariesPagesState, "diagnosisList">) =>
                    CollectionUtils.mapArrayByUniquePredicate(state.diagnosisList, diagnosis => diagnosis.id ? diagnosis.id : 0),
                value: new Map<number, Diagnosis>()
            },
            addedDiagnosisNameField: this._store.createField("addedDiagnosisName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(50),
            ],
                false),
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

    diagnosisList: Diagnosis[],
    editedDiagnosisId: number | undefined,
    editedDiagnosisName: string,
    addedDiagnosisName: string,

}

export type DictionariesPageSelectors = {
    measureListById: Map<number, Species>,
    addedMeasureNameField: Field,

    visitResultListById: Map<number, VisitResult>,
    addedVisitResultNameField: Field,

    diagnosisById: Map<number, Diagnosis>,
    addedDiagnosisNameField: Field,
}