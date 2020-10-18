import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useCustomTableStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            width: "90%",
        },
        tableCell: {
            padding: "8px 4px",
        },
        tableCellFirst: {
            borderBottom: "none",
            paddingLeft: "8px"
        },
        tableCellEnd: {
            paddingRight: "8px"
        },
        folder: {
            width: "1%"
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
        }
    })
);