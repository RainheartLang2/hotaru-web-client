import createMuiTheme, {Theme} from "../../node_modules/@material-ui/core/styles/createMuiTheme";
import {ColorType} from "../core/ColorType";

export const vetTheme: Theme = createMuiTheme({
    palette: {
        primary: {
            main: ColorType.AtBlue,
            light: ColorType.Denim,
            dark: ColorType.PictonBlue,
            contrastText: ColorType.White,
        },
        secondary: {
            main: ColorType.SolitudeBlue,
            light: ColorType.Denim,
            dark: ColorType.LightSolitudeBlue,
            contrastText: ColorType.Denim,
        },
    },
    overrides: {
        MuiBackdrop: {
            root: {
                backgroundColor: ColorType.TransparentWhite,
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
                boxShadow: "none",
                "&:hover": {
                    boxShadow: "none"
                },
            },
            contained: {
                boxShadow: "none",
                "&:hover": {
                    boxShadow: "none"
                },
            },
        },
        MuiLink: {
            root: {
                cursor: "pointer",
            }
        }
    }
});