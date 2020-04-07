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
            light: ColorType.DENIM,
            dark: ColorType.LIGHT_SOLITUDE_BLUE,
            contrastText: ColorType.DENIM,
        },
    },
    overrides: {
        MuiBackdrop: {
            root: {
                backgroundColor: ColorType.TRANSPARENT_WHITE,
            }
        },
        MuiDialog: {
            paper: {
                boxShadow: '0 0 15px 0 rgba(0,0,0,0.4)',
                borderRadius: 10,
            }
        },
        MuiButton: {
            root: {
                textTransform: "none",
            },
            contained: {
                boxShadow: "none",
                "&:hover": {
                    boxShadow: "none"
                },
            }
        }
    }
});