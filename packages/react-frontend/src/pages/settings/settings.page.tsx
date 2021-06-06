import { Box, createStyles, Hidden, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { COLOR_OVERRIDES } from "theme";
import { HeaderTitle } from "../../components/header/header";
import { Settings } from "../../components/settings/settings";

const useSettingsStyle = makeStyles((theme: Theme) => createStyles({
    container: {
        backgroundColor: COLOR_OVERRIDES.hdva_white,
        [theme.breakpoints.down("md")]: {
            marginTop: `70px`
        },
    }
}));

const SettingsPage: React.FC = () => {
    const classes = useSettingsStyle();
    return (
        <React.Fragment>
            <Hidden mdUp>
                <HeaderTitle isFixed title="Settings" alignText="center" color="primary" variant="h5" />
            </Hidden>
            <Box className={classes.container}>
                <Settings variant="light" />
            </Box>
        </React.Fragment>
    );
}

export default SettingsPage;