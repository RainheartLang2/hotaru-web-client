import createMuiTheme, {Theme} from "../../node_modules/@material-ui/core/styles/createMuiTheme";
import {ColorType} from "../core/ColorType";

export const vetTheme: Theme = createMuiTheme({
    palette: {
        primary: {
            main: ColorType.AT_BLUE,
            light: ColorType.DENIM,
            dark: ColorType.PICTON_BLUE,
            contrastText: ColorType.WHITE,
        },
        secondary: {
            main: ColorType.SOLITUDE_BLUE,
            contrastText: ColorType.DENIM,
        },
    }
});