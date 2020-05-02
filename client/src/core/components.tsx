import {ColorType} from "./ColorType";
import withStyles from "@material-ui/core/styles/withStyles";
import {
    AppBar,
    Button,
    CircularProgress,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import {CommonConstants} from "../common/constants.js";

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
        minWidth: CommonConstants.applicationMinimalWidth,
    }
})(AppBar)

export const TableCmp = withStyles({
    root: {
        border: `1px solid ${ColorType.AtGrey}`,
        borderRadius: "5px",
        borderCollapse: "separate",
    }
})(Table)

export const TableHeaderCmp = withStyles({
    root: {
        backgroundColor: ColorType.LightSolitudeBlue,
    }
})(TableHead)

export const TableRowCmp = withStyles({
    root: {
        borderColor: ColorType.AtGrey,
    }
})(TableRow)
export const TableCellCmp = TableCell
export const TableBodyCmp = TableBody

export const Loader = CircularProgress