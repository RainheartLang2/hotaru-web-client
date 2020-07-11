import * as React from "react";
import GoodsPack from "../../beans/GoodsPack";
import ControlledMinorList from "../list/controlled/ControlledMinorList";
import {ReactNode} from "react";
import {ListItemText} from "@material-ui/core";
import SalesUnit from "../../beans/SalesUnit";
import {DateUtils} from "../../../core/utils/DateUtils";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import MeasureUnit from "../../beans/MeasureUnit";
import {CollectionUtils} from "../../../core/utils/CollectionUtils";
import MessageResource from "../../../core/message/MessageResource";
import {ToggleButtonGroup} from "@material-ui/lab";
import ToggleButton from "@material-ui/lab/ToggleButton";

var styles = require("./styles.css")

export default class GoodsList extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props)
        this.state = {
            groupType: GroupType.ByType
        }
    }
    private getSeriesText(item: GoodsPack): string {
        return item.series
                    ? MessageResource.getMessage("list.goods.series.label") + " " + item.series + " "
                    : ""
    }

    private getExpirationText(item: GoodsPack): string {
        return item.expirationDate
                    ? MessageResource.getMessage("list.goods.date.label") + " " + DateUtils.standardFormatDate(item.expirationDate)
                    : ""
    }

    private getTabs(): ReactNode {
        return (<ToggleButtonGroup
                    size={"small"}
                    value={this.state.groupType}
                    exclusive
                    onChange={(event, newValue) => this.setState({groupType: newValue})}
                    className={styles.grouppingButtons}
        >
            <ToggleButton
                value={GroupType.ByType}
            >
                По типу
            </ToggleButton>
            <ToggleButton
                value={GroupType.ByPack}
            >
                По партиям
            </ToggleButton>
        </ToggleButtonGroup>)
    }

    private getListByPack(): ReactNode {
        return (
            <ControlledMinorList<GoodsPack>
                label={this.props.label}
                additionalHeaderComponent={this.getTabs()}
                addButton={false}
                itemsList={this.props.goods}
                renderItem={item => {
                    const salesUnit = this.props.goodsTypes.get(item.goodsTypeId)!
                    const measureUnit = this.props.measureUnits.get(salesUnit.measureUnitId)!
                    return (<>
                        <ListItemText primary={salesUnit.name}
                                      secondary={this.getSeriesText(item) + this.getExpirationText(item)}
                        />
                        <ListItemSecondaryAction>
                            {item.amount + " " + measureUnit.name}
                        </ListItemSecondaryAction>
                    </>)
                }}
            />
        )
    }

    private groupGoodsByType(): [SalesUnit, number][] {
        const map = new Map<SalesUnit, number>()
        this.props.goods.forEach(pack => {
            const salesUnit = this.props.goodsTypes.get(pack.goodsTypeId)!
            let amount = map.get(salesUnit)
            if (!amount) {
                amount = 0
            }
            map.set(salesUnit, amount + pack.amount)
        })
        const result: [SalesUnit, number][] = []
        map.forEach((value, key) => {
            result.push([key, value])
        })
        return result
    }

    private getListByType(): ReactNode {
                    const items = this.groupGoodsByType()
        return (
            <ControlledMinorList<[SalesUnit, number]>
                label={this.props.label}
                additionalHeaderComponent={this.getTabs()}
                addButton={false}
                itemsList={items}
                renderItem={item => {
                    const measureUnit = this.props.measureUnits.get(item[0].measureUnitId)!
                    return (<>
                        <ListItemText primary={item[0].name}
                        />
                        <ListItemSecondaryAction>
                            {item[1] + " " + measureUnit.name}
                        </ListItemSecondaryAction>
                    </>)
                }}
            />
        )
    }

    render() {
        return (
            this.state.groupType == GroupType.ByPack
                ? this.getListByPack()
                : this.getListByType()
        )
    }

}

type Properties = {
    label: ReactNode
    goods: GoodsPack[]
    goodsTypes: Map<number, SalesUnit>
    measureUnits: Map<number, MeasureUnit>
}

type State = {
    groupType: GroupType,
}

enum GroupType {
    ByPack,
    ByType,
}