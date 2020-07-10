import ApplicationStore, {DefaultStateType} from "../../../../core/mvc/store/ApplicationStore";
import {CommonUtils} from "../../../../core/utils/CommonUtils";
import ApplicationController from "../../../../core/mvc/controllers/ApplicationController";
import MinorList, {MinorListProperties} from "../MinorList";
import createLooseObject = CommonUtils.createLooseObject;

var styles = require("./styles.css")

export default class ConnectedMinorListBase<ItemType,
    StateType extends DefaultStateType,
    SelectorsType, StoreType extends ApplicationStore<StateType, SelectorsType>>

    extends MinorList<ItemType, Properties<ItemType, StateType, SelectorsType, StoreType>> {

    constructor(props: Properties<ItemType, StateType, SelectorsType, StoreType>) {
        super(props)
        this.state = {
            items: [],
        }
    }

    componentDidMount(): void {
        this.props.controller.subscribe(this, createLooseObject([[this.props.itemsListProperty, "items"]]))
    }

    componentWillUnmount(): void {
        this.props.controller.unsubscribe(this)
    }
}

type Properties<ItemType,
    StateType extends DefaultStateType,
    SelectorsType, StoreType extends ApplicationStore<StateType, SelectorsType>> = MinorListProperties<ItemType> & {

    controller: ApplicationController<StateType, SelectorsType, StoreType>
    itemsListProperty: keyof (StateType & SelectorsType)
}

type State<ItemType> = {
    items: ItemType[]
}