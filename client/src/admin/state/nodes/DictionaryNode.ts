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
import VisitPurpose from "../../../common/beans/VisitPurpose";
import {AnimalColor} from "../../../common/beans/AnimalColor";

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

            visitPurposesList: [],
            editedVisitPurposeId: undefined,
            editedVisitPurposeName: "",
            addedVisitPurposeName: "",

            diagnosisList: [],
            editedDiagnosisId: undefined,
            editedDiagnosisName: "",
            addedDiagnosisName: "",

            animalColorsList: [],
            editedAnimalColorId: undefined,
            editedAnimalColorName: "",
            addedAnimalColorName: "",
        }
    }

    public getSelectors(): SelectorsInfo<EmployeeAppState & EmployeeAppSelectors, DictionariesPageSelectors> {
        return {
            measureListById: {
                dependsOn: ["measureList"],
                get: (state: Pick<DictionariesPagesState, "measureList">) =>
                    CollectionUtils.mapIdentifiableArray(state.measureList),
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
                    CollectionUtils.mapIdentifiableArray(state.visitResultsList),
                value: new Map<number, VisitResult>(),
            },
            addedVisitResultNameField: this._store.createField("addedVisitResultName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(50),
            ],
                false),
            visitPurposesListById: {
                dependsOn: ["visitPurposesList"],
                get: (state: Pick<DictionariesPagesState, "visitPurposesList">) => CollectionUtils.mapIdentifiableArray(state.visitPurposesList),
                value: new Map<number, VisitResult>(),
            },
            addedVisitPurposeNameField: this._store.createField("addedVisitPurposeName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(50),
            ],
                false),
            diagnosisById: {
                dependsOn: ["diagnosisList"],
                get: (state: Pick<DictionariesPagesState, "diagnosisList">) =>
                    CollectionUtils.mapIdentifiableArray(state.diagnosisList),
                value: new Map<number, Diagnosis>()
            },
            addedDiagnosisNameField: this._store.createField("addedDiagnosisName", "", [
                new RequiredFieldValidator(),
                new MaximalLengthValidator(50),
            ],
                false),
            animalColorsById: {
                dependsOn: ["animalColorsList"],
                get: (state: Pick<DictionariesPagesState, "animalColorsList">) =>
                    CollectionUtils.mapIdentifiableArray(state.animalColorsList),
                value: new Map<number, AnimalColor>()
            },
            addedAnimalColorNameField: this._store.createField("addedAnimalColorName", "", [
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

    visitPurposesList: VisitPurpose[],
    editedVisitPurposeId: number | undefined,
    editedVisitPurposeName: string,
    addedVisitPurposeName: string,

    diagnosisList: Diagnosis[],
    editedDiagnosisId: number | undefined,
    editedDiagnosisName: string,
    addedDiagnosisName: string,

    animalColorsList: AnimalColor[],
    editedAnimalColorId: number | undefined,
    editedAnimalColorName: string,
    addedAnimalColorName: string,
}

export type DictionariesPageSelectors = {
    measureListById: Map<number, Species>,
    addedMeasureNameField: Field,

    visitResultListById: Map<number, VisitResult>,
    addedVisitResultNameField: Field,

    visitPurposesListById: Map<number, VisitPurpose>,
    addedVisitPurposeNameField: Field,

    diagnosisById: Map<number, Diagnosis>,
    addedDiagnosisNameField: Field,

    animalColorsById: Map<number, AnimalColor>,
    addedAnimalColorNameField: Field,
}