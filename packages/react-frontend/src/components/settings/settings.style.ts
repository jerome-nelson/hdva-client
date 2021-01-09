import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { SettingsProps } from "components/settings/settings";
import { COLOR_OVERRIDES } from "theme";

export const useSettingsStyles = makeStyles((theme: Theme) =>
createStyles({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: ({ variant }: SettingsProps) => variant === "light" ? COLOR_OVERRIDES.hdva_white : theme.palette.background.paper,
    },
    listItem: {
        "& span": {
            color: ({ variant }: SettingsProps) => variant === "light" ? theme.palette.background.paper : COLOR_OVERRIDES.hdva_white,
            fontSize: '1.1rem',
        }
    },
    listHeader: {
        color: COLOR_OVERRIDES.hdva_red,
        textTransform: "uppercase",
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '12px',
        marginTop: '20px',
        marginBottom: '10px'
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}),
);