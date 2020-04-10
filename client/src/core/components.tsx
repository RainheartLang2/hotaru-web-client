import {ColorType} from "./ColorType";
import withStyles from "@material-ui/core/styles/withStyles";
import {
    AppBar,
    Button, CircularProgress, Dialog,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";

export const ButtonComponent = withStyles({
    root: {
        textTransform: "none",
        boxShadow: "none",
        "&:hover": {
            boxShadow: "none"
        }
    }
})(Button)

export const AppHeader = withStyles({
    root: {
        //TODO: make constant value
        minWidth: 800,
    }
})(AppBar)

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