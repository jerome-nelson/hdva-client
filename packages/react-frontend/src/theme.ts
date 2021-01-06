import { createMuiTheme } from '@material-ui/core/styles';
import { FontWeightProperty, TextTransformProperty } from "csstype";

// TODO: (Not impt) - how can I use light/dark contrasts for headers

// This file is used to merge hdva styles with Material-UI. By merging and not
// overriding, I can avoid unnecessary screen painting/calculations
//
// References
// https://material-ui.com/customization/components/#overriding-styles-with-classes

export const COLOR_OVERRIDES = {
    hdva_white: "#fafafa",
    hdva_black: "#1b1b1b",
    hdva_black_light: "#969696",
    hdva_grey_light: "#cccccc",
    hdva_grey: "#7f7f7f",
    hdva_red: "#f01656",
    hdva_red_dark: "#b6002e"
}

const OPACITY_BASE = 0.4;
const WIDTHS = {
    min: `480px`
};

export const STYLE_OVERRIDES = {
    carousel: {
        itemHeight: 325,
        imageHeight: 250,
        itemWidth: 455,
    },
    input: {
        disabled: {
            opacity: OPACITY_BASE,
            color: COLOR_OVERRIDES.hdva_black
        },
        main: {
            padding: `8px 0 9px`
        },
    },
    button: {
        disabled: {
            backgroundColor: COLOR_OVERRIDES.hdva_white,
            border: `solid 1px ${COLOR_OVERRIDES.hdva_red}`,
            color: COLOR_OVERRIDES.hdva_red,
            opacity: OPACITY_BASE
        },
        disabledInverse: {
            backgroundColor: COLOR_OVERRIDES.hdva_black,
            border: `solid 1px ${COLOR_OVERRIDES.hdva_white}`,
            color: COLOR_OVERRIDES.hdva_white,
            opacity: OPACITY_BASE
        },
        main: {
            borderRadius: `8px`,
            boxShadow: `none`,
            fontSize: `16px`,
            textTransform: "capitalize" as TextTransformProperty,
            padding: `10px 20px`
        }
    },
    paper: {
        main: {
            padding: "24px"
        },
    },
    heading: {
        main: {
            fontWeight: "bolder" as FontWeightProperty,
        },
        sub: {
            fontWeight: "lighter" as FontWeightProperty,
        }
    }
}

export const theme = createMuiTheme({
    palette: {
        type: "dark"
    },
    typography: {
        // TODO: Change these to variants instead
        h2: {
            color: COLOR_OVERRIDES.hdva_red,
            fontWeight: STYLE_OVERRIDES.heading.main.fontWeight
        },
        h4: {
            color: COLOR_OVERRIDES.hdva_red,
            fontWeight: STYLE_OVERRIDES.heading.main.fontWeight
        },
        h5: {
            color: COLOR_OVERRIDES.hdva_black,
            fontWeight: STYLE_OVERRIDES.heading.sub.fontWeight
        },
        h6: {
            color: COLOR_OVERRIDES.hdva_black,
            fontWeight: STYLE_OVERRIDES.heading.sub.fontWeight
        }
    },
    overrides: {
        MuiAppBar: {
            colorPrimary: {
                color: COLOR_OVERRIDES.hdva_black,
                backgroundColor: COLOR_OVERRIDES.hdva_white
            },
        },
        MuiCssBaseline: {
            '@global': {
                body: {
                    minWidth: WIDTHS.min,
                }
            }
        },
        MuiInputBase: {
            root: STYLE_OVERRIDES.input.main,
        },
        MuiSvgIcon: {
            colorSecondary: {
                color: COLOR_OVERRIDES.hdva_black,
            }
        },
        MuiOutlinedInput: {
            input: {
                padding: '6px 14px',
                borderRadius: `4px`
            },
        },
        MuiInput: {
            colorSecondary: {
                color: COLOR_OVERRIDES.hdva_black,
                "&.Mui-disabled": STYLE_OVERRIDES.input.disabled,
                "&.MuiInput-underline::before": {
                    borderBottom: `1px solid ${COLOR_OVERRIDES.hdva_black_light} !important`
                },
            }
        },
        MuiButton: {
            containedSizeSmall: STYLE_OVERRIDES.button.main,
            outlinedSizeSmall: STYLE_OVERRIDES.button.main,
            containedPrimary: {
                backgroundColor: COLOR_OVERRIDES.hdva_red,
                color: COLOR_OVERRIDES.hdva_white,
                "&:hover": {
                    backgroundColor: COLOR_OVERRIDES.hdva_red_dark,
                },
                "&:disabled": STYLE_OVERRIDES.button.disabled
            },
            containedSecondary: {
                backgroundColor: COLOR_OVERRIDES.hdva_red,
                color: COLOR_OVERRIDES.hdva_white,
                "&:hover": {
                    backgroundColor: COLOR_OVERRIDES.hdva_red_dark,
                },
                "&:disabled": STYLE_OVERRIDES.button.disabledInverse
            },
            outlinedPrimary: {
                border: `1px solid ${COLOR_OVERRIDES.hdva_white}`,
                color: COLOR_OVERRIDES.hdva_white,
                "&:hover": {
                    border: `1px solid ${COLOR_OVERRIDES.hdva_black_light}`,
                    backgroundColor: COLOR_OVERRIDES.hdva_white,
                    color: COLOR_OVERRIDES.hdva_black
                },
            },
            textPrimary: {
                ...STYLE_OVERRIDES.button.main,
                color: COLOR_OVERRIDES.hdva_white
            },
        },
        MuiCircularProgress: {
            colorSecondary: {
                color: COLOR_OVERRIDES.hdva_white
            }
        },
        MuiPaper: {
            root: {
                backgroundColor: COLOR_OVERRIDES.hdva_white,
                padding: STYLE_OVERRIDES.paper.main.padding
            }
        },
        MuiTypography: {
            subtitle1: {
                color: COLOR_OVERRIDES.hdva_black,
                fontWeight: STYLE_OVERRIDES.heading.sub.fontWeight
            }
        }
    }
});

//  BG Dark Color: "#263238"
//  Light Heading Colour (h1, h2)
//  "#f01656"