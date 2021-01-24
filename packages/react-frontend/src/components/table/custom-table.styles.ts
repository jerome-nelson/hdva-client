import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useCustomTableStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            width: "90%",
            [theme.breakpoints.down('md')]: {
                width: "100%",

                "& th:last-child": {
                    textAlign: "right"
                },
                "& tbody td": {
                    wordBreak: "break-word",
                },
                "& tbody td:first-child": {
                    paddingLeft: `${theme.spacing(2)}px`
                },
                "& tbody td:last-child": {
                    paddingRight: `${theme.spacing(2)}px`,
                    textAlign: "right"
                }
            }
        },
        txtLink: {
            color: "#000",
            display: "block",
            textDecoration: "none"
        },
        name: {
            width: "40%"
        },
        fullwidth: {
            textAlign: "center",
            width: "100%"
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        tableRow: {
            cursor: "pointer"
        },
    })
);