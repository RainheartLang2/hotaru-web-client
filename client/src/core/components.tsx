import {ColorType} from "./ColorType";
import withStyles from "@material-ui/core/styles/withStyles";
import {
    AppBar,
    Button, CircularProgress,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";

export const InputField = TextField

//TODO: Delete
export const CommonButton = Button
export const ButtonComponent = withStyles({
    root: {
        textTransform: "none",
        boxShadow: "none",
        "&:hover": {
            boxShadow: "none"
        }
    }
})(Button)

export const PaperComponent = Paper
export const AppHeader = withStyles({
    root: {
        //TODO: make constant value
        minWidth: 800,
    }
})(AppBar)
export const TabComponent = Tab

export const TableCmp = withStyles({
    root: {
        border: `1px solid ${ColorType.AT_GREY}`,
        borderRadius: "5px",
        borderCollapse: "separate",
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

export const Loader = CircularProgress