import { InputBase, withStyles } from "@material-ui/core";

export const BootstrapInput = withStyles((theme) => ({
    root: {
        width: `100%`,
        "& .MuiSelect-icon": {
            color: `#1b1b1b !important`,
            right: "5px"
        }
    },
    input: {
        border: `1px solid rgba(1,1,1,0.29)`,
        borderRadius: 4,
        color: `#1b1b1b !important`,
        position: 'relative',
        backgroundColor: `transparent`,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: 4,
            // TODO: Hex/RGBA/HSLA conversion function
            boxShadow: '0 0 0 0.1rem rgba(240,22,86,1)',
        },
    },
}))(InputBase);