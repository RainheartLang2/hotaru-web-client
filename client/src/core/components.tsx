import {
    AppBar,
    Button,
    Paper,
    Tab,
    Table, TableBody,
    TableCell,
    TableHead, TableRow,
    TextField
} from "../../node_modules/@material-ui/core/index";
import {withStyles} from "../../node_modules/@material-ui/core/styles/index";
import {ColorType} from "./ColorType";

export const InputField = TextField
export const CommonButton = Button
export const PaperComponent = Paper
export const AppBarComponent = AppBar
export const TabComponent = Tab

export const TableCmp = withStyles({
    root: {
        border: `1px solid ${ColorType.AT_GREY}`,
        borderRadius: '5px',
        borderCollapse: 'separate',
    }
})(Table)

export const TableHeaderCmp = withStyles({
    root: {
        backgroundColor: ColorType.LIGHT_SOLITUDE_BLUE,
    }
})(TableHead)

export const TableRowCmp = withStyles({
    root: {
        borderColor: ColorType.AT_GREY,
    }
})(TableRow)
export const TableCellCmp = TableCell
export const TableBodyCmp = TableBody