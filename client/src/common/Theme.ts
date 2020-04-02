import createMuiTheme, {Theme} from "../../node_modules/@material-ui/core/styles/createMuiTheme";
import {green, red} from "../../node_modules/@material-ui/core/colors/index";

export const mainTheme: Theme = createMuiTheme({
    palette: {
        primary: {
            main: "#ffa500",
            contrastText: "#fff",
        },
        secondary: green,
        error: red,
    },
});