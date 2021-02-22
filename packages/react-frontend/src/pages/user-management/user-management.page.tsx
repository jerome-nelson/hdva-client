import { Box, Breadcrumbs, Grid, Hidden, InputAdornment, Link, Paper, TextField, Typography } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import Skeleton from "@material-ui/lab/Skeleton";
import { GenericTable } from "components/table/generic-table";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import React from "react";
import { useGenericStyle } from "utils/generic.style";
import { HeaderTitle } from "../../components/header/header";
import { messages } from "../../config/en";
import { useUserStyles } from "./user-management.page.style";

const SearchUsers: React.FC = () => {
    const generic = useGenericStyle();
    return (
        <TextField
            className={generic.fullWidth}
            placeholder="Search for users"
            color="secondary"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="secondary" />
                    </InputAdornment>
                ),
            }}
        />
    );
}

export const UserPage: React.FC = () => {
    const classes = useUserStyles();
    return (
        <Box>
            <Hidden mdDown>
                <Breadcrumbs className={classes.breadcrumb} separator="›" aria-label="breadcrumb">
                    <Link color="textSecondary" href="/" onClick={() => { }} className={classes.link}>
                        <FolderSVG className={classes.icon} /> HDVA
                    </Link>
                    <Link color="secondary" onClick={() => { }} className={classes.link}>
                        {messages["user.page.title"]}
                    </Link>
                </Breadcrumbs>
            </Hidden>
            <Hidden mdUp>
                <HeaderTitle isFixed alignText="center" color="primary" variant="h5" title={messages["user.page.title"]} />
            </Hidden>
            <Grid container>
                <Grid md={4} xs={12}>
                    <Paper className={classes.paperOverride}>
                        <SearchUsers />
                        <Typography color="primary" variant="h6">
                            Recent Users
                        </Typography>
                        <Skeleton className={classes.variantBG} variant="circle" animation="pulse" height={30} width={30}/>
                        <Skeleton className={classes.variantBG} variant="rect" animation="pulse" width={150} height={20} />
                        <GenericTable
                            cells={[]}
                            data={[]}
                        />
                    </Paper>
                </Grid>
            </Grid>
            {/* <Hidden mdUp>
                <HeaderTitle disableBack title={} />
            </Hidden>
            <Grid container>
                {
                    users.isLoading ?
                        <CircularProgress size="1.5rem" color="secondary" /> :
                        <React.Fragment>
                            <Grid container alignItems="center">
                            </Grid>
                            {(
                                users.noData ?
                                    (
                                        "no dataaa"
                                    ) :
                                    <Grid container alignItems="center">
                                        <Box>
                                            <h3>{messages["groups-management.list"]}</h3>
                                        </Box>
                                        <CustomTable user={user} headers={headCells} data={data}>
                                            {(hasSelected: string[] | undefined) => (
                                                <React.Fragment>
                                                    <Hidden only={["md", "lg", "xl"]}>
                                                        <Button
                                                            onClick={() => alert(`Should delete selected:  ${hasSelected && hasSelected.join(",")}`)}
                                                            fullWidth
                                                            className={genericClasses.actionButton}
                                                            disabled={!hasSelected || (hasSelected && hasSelected.length <= 0)}
                                                            size="large" variant="outlined" color="primary"
                                                        >
                                                            {messages["button.delete"]}
                                                        </Button>
                                                    </Hidden>
                                                    <Hidden only={["xs", "sm"]}>
                                                        <Grid container xs={10} spacing={1}>
                                                            <Grid item>
                                                                <Button
                                                                    onClick={() => alert(`Should delete properties from pids:  ${hasSelected && hasSelected.join(",")}`)}
                                                                    fullWidth
                                                                    className={genericClasses.actionButton}
                                                                    disabled={!hasSelected || (hasSelected && hasSelected.length <= 0)}
                                                                    size="medium" variant="outlined" color="primary"
                                                                >
                                                                    {messages["button.delete"]}
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </Hidden>
                                                </React.Fragment>
                                            )}
                                        </CustomTable>
                                    </Grid>
                            )}
                        </React.Fragment>
                }
            </Grid> */}
        </Box>
    );
}