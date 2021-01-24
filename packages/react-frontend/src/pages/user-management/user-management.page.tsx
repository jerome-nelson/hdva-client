import { Box, Grid, Hidden } from "@material-ui/core";
import React from "react";
import { HeaderTitle } from "../../components/header/header";
import { StickyHeader } from "../../components/sticky-header/sticky-header";
import { messages } from "../../config/en";

export const UserPage: React.FC = () => {
    return (
        <Box>
            <Hidden mdUp>
                <StickyHeader>
                    <Grid container>
                        <Grid xs={8}>
                            <HeaderTitle isFixed disableBack alignText="left" title={messages["user.page.title"]} disableGutters />
                        </Grid>
                    </Grid>
                </StickyHeader>
            </Hidden>
            {/* <Hidden mdUp>
                <HeaderTitle disableBack title={messages["user-management.title"]} />
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