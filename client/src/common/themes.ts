import createMuiTheme, {Theme} from "../../node_modules/@material-ui/core/styles/createMuiTheme";
import {ColorType} from "../core/ColorType";

const palette = {
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
    info: {
        main: ColorType.Orange,
    }
}

export const vetTheme: Theme = createMuiTheme({
    palette: palette,
    overrides: {
        MuiMenuItem: {
            root: {
                "&:hover": {
                    color: palette.info.main,
                }
            }
        },
        MuiTab: {
            wrapper: {
                "&:hover": {
                    color: palette.info.main,
                }
            },
        },
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
        },
        MuiOutlinedInput: {
            root: {
                backgroundColor: "white",
            },
            input: {
                paddingTop: "10.5px",
                paddingBottom: "10.5px",
            }
        },
        MuiInputBase: {
            root: {
                "&:hover": {

                }
            }
        },
        MuiList: {
            padding: {
                paddingTop: "0",
                paddingBottom: "0",
            }
        }
    }
});