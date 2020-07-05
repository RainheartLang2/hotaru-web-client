import EmployeeAppController from "../EmployeeAppController";
import MeasureUnit from "../../../common/beans/MeasureUnit";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import {RemoteMethod} from "../../../core/http/RemoteMethod";
import {EmployeeAppState, EmployeeStateContext} from "../../state/EmployeeApplicationStore";
import Identifiable from "../../../core/entities/Identifiable";
import VisitResult from "../../../common/beans/VisitResult";
import Diagnosis from "../../../common/beans/Diagnosis";
import VisitPurpose from "../../../common/beans/VisitPurpose";
import {AnimalColor} from "../../../common/beans/AnimalColor";
import {SalesCategory} from "../../../common/beans/SalesCategory";
import {StringUtils} from "../../../core/utils/StringUtils";
import {SalesType} from "../../../common/beans/enums/SalesType";
import StateChangeContext from "../../../core/mvc/store/StateChangeContext";
import {CommonActionsFunctions} from "./CommonActionsFunctions";

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

    public loadList(method: RemoteMethod, resultKey: keyof EmployeeAppState, callback: Function, context?: EmployeeStateContext,
                    parseResponse: (result: any) => any = result => result): void {
        CommonActionsFunctions.loadList(this.controller, method, resultKey, callback, context, parseResponse)
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

    public loadAnimalColorsList(callback: Function = () => {}, context?: EmployeeStateContext): void {
        this.controller.cacheManager.animalColorCache.execute(callback, context)
    }

    public loadSalesCategories(callback: Function = () => {}, context?: EmployeeStateContext): void {
        this.controller.cacheManager.salesCategoriesCache.execute(callback, context)
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

    public submitCreateSalesCategory(callback: Function = () => {}): void {
        const item: SalesCategory = new SalesCategory({
            name: this.controller.state.addedSalesCategoryNameField.value,
            salesType: this.controller.state.addedSalesCategoryType!,
            extraCharge: +this.controller.state.addedSalesCategoryExtraChargeField.value,
        })
        const setState = (item: SalesCategory) => {
            this.controller.setState({
                salesCategoriesList: [...this.controller.state.salesCategoriesList, item],
                addedSalesCategoryName: "",
                addedSalesCategoryType: SalesType.Goods,
                addedSalesCategoryExtraCharge: "",
            })
        }
        this.submitCreateItem(item, RemoteMethods.addSalesCategory, setState, callback)
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

    public setSalesCategoryId(id?: number) {
        if (id) {
            const category = this.controller.state.salesCategoriesById.get(id)
            if (!category) {
                throw new Error("no category with id " + id)
            }
            this.controller.setState({
                editedSalesCategoryId: id,
                editedSalesCategoryName: category.getName(),
                editedSalesCategoryType: category.getSalesType(),
                editedSalesCategoryExtraCharge: StringUtils.numberToStringEmptyIfZero(category.getExtraCharge()),
            })
        } else {
            this.controller.setState({
                editedSalesCategoryId: id,
                editedSalesCategoryName: "",
                editedSalesCategoryType: null,
                editedSalesCategoryExtraCharge: "",
            })
        }
    }

    public setEditedSalesCategoryName(name: string) {
        this.controller.setState({
            editedSalesCategoryName: name,
        })
    }

    public setEditedSalesCategoryType(type: SalesType) {
        this.controller.setState({
            editedSalesCategoryType: type
        })
    }

    public setEditedSalesCategoryExtraCharge(extraCharge: string) {
        this.controller.setState({
            editedSalesCategoryExtraCharge: extraCharge
        })
    }

    public submitEditSalesCategory(callback: Function = () => {}) {
        const item: SalesCategory = new SalesCategory({
            id: this.controller.state.editedSalesCategoryId,
            name: this.controller.state.editedSalesCategoryName,
            salesType: this.controller.state.editedSalesCategoryType!,
            extraCharge: StringUtils.stringToNumberZeroIfEmpty(this.controller.state.editedSalesCategoryExtraCharge)
        })
        this.submitEditItem(item, RemoteMethods.editSalesCategory, "salesCategoriesList", callback)
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

    public deleteSalesCategory(id: number): void {
        this.deleteItem(id, RemoteMethods.deleteSalesCategory, "salesCategoriesList")
    }

    public getSalesCategoryById(id: number): SalesCategory {
        const result = this.controller.state.salesCategoriesById.get(id)
        if (!result) {
            throw new Error("no sales category for id " + id)
        }
        return result
    }

    public getMeasureUnitById(id: number): MeasureUnit {
        const result = this.controller.state.measureListById.get(id)
        if (!result) {
            throw new Error("no measure unit for id " + id)
        }
        return result
    }
}