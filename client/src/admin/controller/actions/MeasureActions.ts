import EmployeeAppController from "../EmployeeAppController";
import Measure from "../../../common/beans/Measure";
import {fetchUserZoneRpc} from "../../../core/utils/HttpUtils";
import {RemoteMethods} from "../../../common/backApplication/RemoteMethods";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";

export default class MeasureActions {

    private controller: EmployeeAppController

    constructor(controller: EmployeeAppController) {
        this.controller = controller;
    }

    public setEditedMeasureId(id?: number) {
        this.controller.setState({editedMeasureId: id})
    }

    public setEditedMeasureName(name: string) {
        this.controller.setState({editedMeasureName: name})
    }

    private getMeasureById(id: number): Measure {
        const result = this.controller.state.measureListById.get(id)
        if (!result) {
            throw new Error("measure with id " + id + " not exists")
        }
        return result
    }

    public loadList(params: any[] = [], callback: Function = () => {}): void {
        fetchUserZoneRpc({
            method: RemoteMethods.getAllMeasure,
            params: params,
            successCallback: result => {
                this.controller.setState({
                    measureList: result
                })
                callback(result)
            },
        })
    }

    public submitCreateItem(callback: Function = () => {}): void {
        const item: Measure = {
            name: this.controller.state.addedMeasureName
        }
        fetchUserZoneRpc({
            method: RemoteMethods.addMeasure,
            params: [item],
            successCallback: (result) => {
                item.id = +result
                this.controller.setState({
                    measureList: [...this.controller.state.measureList, item],
                    addedMeasureName: "",
                })
                callback()
            },
        })
    }

    public submitEditItem(callback: Function = () => {}): void {
        const item: Measure = {
            id: this.controller.state.editedMeasureId,
            name: this.controller.state.editedMeasureName,
        }
        fetchUserZoneRpc({
            method: RemoteMethods.editMeasure,
            params: [item],
            successCallback: result => {
                this.controller.setState({
                    measureList: CollectionUtils.updateArray(this.controller.state.measureList, item, measure => measure.id)
                })
                callback
            }
        })
    }

    public deleteMeasure(id: number): void {
        fetchUserZoneRpc({
            method: RemoteMethods.deleteMeasure,
            params: [id],
            successCallback: (result) => this.controller.setState({
                measureList: this.controller.state.measureList.filter(measure => measure.id != id)
            }),
        })
    }
}