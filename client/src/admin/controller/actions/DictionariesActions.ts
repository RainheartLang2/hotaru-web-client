import EmployeeAppController from "../EmployeeAppController";
import MeasureUnit from "../../../common/beans/MeasureUnit";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {EmployeeAppState} from "../../state/EmployeeApplicationStore";
import Identifiable from "../../../core/entities/Identifiable";
import VisitResult from "../../../common/beans/VisitResult";
import Diagnosis from "../../../common/beans/Diagnosis";
import VisitPurpose from "../../../common/beans/VisitPurpose";
import {AnimalColor} from "../../../common/beans/AnimalColor";

export default class DictionariesActions {

    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public setEditedMeasureId(id?: number) {
        this.controller.setState({editedMeasureId: id})
    }

    public setEditedDiagnosisId(id?: number) {
        this.controller.setState({editedDiagnosisId: id})
    }

    public setEditedVisitPurposeId(id?: number) {
        this.controller.setState({editedVisitPurposeId: id})
    }

    public setEditedAnimalColorId(id?: number) {
        this.controller.setState({editedAnimalColorId: id})
    }

    public setEditedMeasureName(name: string) {
        this.controller.setState({editedMeasureName: name})
    }

    public setEditedDiagnosisName(name: string) {
        this.controller.setState({editedDiagnosisName: name})
    }

    public setEditedVisitPurposeName(name: string) {
        this.controller.setState({editedVisitPurposeName: name})
    }

    public setEditedAnimalColorName(name: string) {
        this.controller.setState({editedAnimalColorName: name})
    }

    private getMeasureById(id: number): MeasureUnit {
        const result = this.controller.state.measureListById.get(id)
        if (!result) {
            throw new Error("measure with id " + id + " not exists")
        }
        return result
    }

    public loadList(method: RemoteMethod, resultKey: keyof EmployeeAppState, callback: Function): void {
        fetchUserZoneRpc({
            method,
            successCallback: result => {
                this.controller.setState({
                    [resultKey]: result,
                })
                callback(result)
            },
        })
    }

    public loadMeasureUnits(params: any[] = [], callback: Function = () => {}): void {
        this.loadList(RemoteMethods.getAllMeasure, "measureList", callback)
    }

    public loadVisitResult(callback: Function = () => {}): void {
        this.loadList(RemoteMethods.getAllVisitResults, "visitResultsList", callback)
    }

    public loadVisitPurposes(callback: Function = () => {}): void {
        this.loadList(RemoteMethods.getAllVisitPurposes, "visitPurposesList", callback)
    }

    public loadDiagnosisList(callback: Function = () => {}): void {
        this.loadList(RemoteMethods.getAllDiagnosis, "diagnosisList", callback)
    }

    public loadAnimalColorsList(callback: Function = () => {}): void {
        this.controller.cacheManager.animalColorCache.execute(callback)
    }

    private submitCreateItem<Type extends Identifiable>(item: Type,
                                                        method: RemoteMethod,
                                                        setState: (item:Type) => void,
                                                        callback: Function ): void {
        fetchUserZoneRpc({
            method,
            params: [item],
            successCallback: (result) => {
                item.id = +result
                setState(item)
                callback()
            },
        })
    }

    public submitCreateMeasureUnit(callback: Function = () => {}): void {
        const item: MeasureUnit = {
            name: this.controller.state.addedMeasureName
        }
        const setState = (item: MeasureUnit) => {
            this.controller.setState({
                measureList: [...this.controller.state.measureList, item],
                addedMeasureName: "",
            })
            this.controller.toggleFieldValidation("addedMeasureNameField", false)
        }
        this.submitCreateItem(item, RemoteMethods.addMeasure, setState, callback)
    }

    public submitCreateVisitResult(callback: Function = () => {}): void {
        const item: VisitResult = {
            name: this.controller.state.addedVisitResultName
        }
        const setState = (item: VisitResult) => {
            this.controller.setState({
                visitResultsList: [...this.controller.state.visitResultsList, item],
                addedVisitResultName: "",
            })
            this.controller.toggleFieldValidation("addedVisitResultNameField", false)
        }
        this.submitCreateItem(item, RemoteMethods.addVisitResult, setState, callback)
    }

    public submitCreateVisitPurpose(callback: Function = () => {}): void {
        const item: VisitPurpose = {
            name: this.controller.state.addedVisitPurposeName
        }
        const setState = (item: VisitPurpose) => {
            this.controller.setState({
                visitPurposesList: [...this.controller.state.visitPurposesList, item],
                addedVisitPurposeName: "",
            })
            this.controller.toggleFieldValidation("addedVisitPurposeNameField", false)
        }
        this.submitCreateItem(item, RemoteMethods.addVisitPurpose, setState, callback)
    }

    public submitCreateDiagnosis(callback: Function = () => {}): void {
        const item: Diagnosis = {
            name: this.controller.state.addedDiagnosisName
        }
        const setState = (item: Diagnosis) => {
            this.controller.setState({
                diagnosisList: [...this.controller.state.diagnosisList, item],
                addedDiagnosisName: "",
            })
            this.controller.toggleFieldValidation("addedDiagnosisNameField", false)
        }
        this.submitCreateItem(item, RemoteMethods.addDiagnosis, setState, callback)
    }

    public submitCreateAnimalColor(callback: Function = () => {}): void {
        const item: AnimalColor = {
            name: this.controller.state.addedAnimalColorName
        }
        const setState = (item: AnimalColor) => {
            this.controller.setState({
                animalColorsList: [...this.controller.state.animalColorsList, item],
                addedAnimalColorName: "",
            })
            this.controller.toggleFieldValidation("addedAnimalColorNameField", false)
        }
        this.submitCreateItem(item, RemoteMethods.addAnimalColor, setState, callback)
    }

    private submitEditItem<Type extends Identifiable>(item: Type, method: RemoteMethod, listPropertyKey: keyof EmployeeAppState, callback: Function): void {
        fetchUserZoneRpc({
            method,
            params: [item],
            successCallback: result => {
                this.controller.setState({
                    [listPropertyKey]: CollectionUtils.updateArray(this.controller.state[listPropertyKey] as Type[], item, entry => entry.id)
                })
                callback
            }
        })
    }

    public submitEditMeasureUnit(callback: Function = () => {}): void {
        const item: MeasureUnit = {
            id: this.controller.state.editedMeasureId,
            name: this.controller.state.editedMeasureName,
        }
        this.submitEditItem(item, RemoteMethods.editMeasure, "measureList", callback)
    }

    public submitEditVisitResult(callback: Function = () => {}): void {
        const item: VisitResult = {
            id: this.controller.state.editedVisitResultId,
            name: this.controller.state.editedVisitResultName,
        }
        this.submitEditItem(item, RemoteMethods.editVisitResult, "visitResultsList", callback)
    }

    public submitEditVisitPurpose(callback: Function = () => {}): void {
        const item: VisitPurpose = {
            id: this.controller.state.editedVisitPurposeId,
            name: this.controller.state.editedVisitPurposeName,
        }
        this.submitEditItem(item, RemoteMethods.editVisitPurpose, "visitPurposesList", callback)
    }

    public submitEditDiagnosis(callback: Function = () => {}): void {
        const item: Diagnosis = {
            id: this.controller.state.editedDiagnosisId,
            name: this.controller.state.editedDiagnosisName,
        }
        this.submitEditItem(item, RemoteMethods.editDiagnosis, "diagnosisList", callback)
    }

    public submitEditAnimalColor(callback: Function = () => {}): void {
        const item: AnimalColor = {
            id: this.controller.state.editedAnimalColorId,
            name: this.controller.state.editedAnimalColorName,
        }
        this.submitEditItem(item, RemoteMethods.editAnimalColor, "animalColorsList", callback)
    }

    private deleteItem(id: number, method: RemoteMethod, propertyKey: keyof EmployeeAppState): void {
        fetchUserZoneRpc({
            method,
            params: [id],
            successCallback: (result) => this.controller.setState({
                [propertyKey]: (this.controller.state[propertyKey] as Identifiable[]).filter(item => item.id != id)
            }),
        })
    }

    public deleteMeasure(id: number): void {
        this.deleteItem(id, RemoteMethods.deleteMeasure, "measureList")
    }

    public deleteVisitResult(id: number): void {
        this.deleteItem(id, RemoteMethods.deleteVisitResult, "visitResultsList")
    }

    public deleteVisitPurpose(id: number): void {
        this.deleteItem(id, RemoteMethods.deleteVisitPurpose, "visitPurposesList")
    }

    public deleteDiagnosis(id: number): void {
        this.deleteItem(id, RemoteMethods.deleteDiagnosis, "diagnosisList")
    }

    public deleteAnimalColor(id: number): void {
        this.deleteItem(id, RemoteMethods.deleteAnimalColor, "animalColorsList")
    }
}