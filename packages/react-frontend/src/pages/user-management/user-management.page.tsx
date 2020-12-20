import { Box, Button, CircularProgress, Grid, Hidden } from "@material-ui/core";
import React from "react";
import { HeaderTitle } from "../../components/header/header";
import { StickyHeader } from "../../components/sticky-header/sticky-header";
import { useAPI } from "../../hooks/useAPI";
import { messages } from "../../languages/en";
import { getCurrentUser, User } from "../../services/auth.service";
import { useGenericStyle } from "../../utils/generic.style";
import { useGroupStyle } from "./user-management.page.style";

export const UserPage: React.FC = () => {
    const user = getCurrentUser();
    const [users] = useAPI<User>(`/users`, {
        extraHeaders: {
            'Authorization': user.token
        }
    });
    const classes = useGroupStyle();
    const genericClasses = useGenericStyle();

    const { data } = users;

    const headCells: Record<string, unknown>[] = [
        { id: 'icon', label: 'Name' },
        { id: 'name', numeric: false, disablePadding: false, label: "" },
        { id: 'description', numeric: false, disablePadding: false, label: "" },
    ];

    return (
        <Box>
            <Hidden mdUp>
                <StickyHeader>
                    <Grid container>
                        <Grid xs={8}>
                            <HeaderTitle disableBack alignText="left" title={messages["user.page.title"]} disableGutters />
                        </Grid>
                        <Grid xs={4}>
                            <Button type="submit" className={genericClasses.actionButton} fullWidth size="large" variant="outlined" color="primary">
                                {(user.isLoading) ? <CircularProgress size="1.5rem" color="secondary" /> : messages["user.page.add"]}
                            </Button>
                        </Grid>
                    </Grid>
                </StickyHeader>
            </Hidden>
            <div style={{
                height: "1000px",
                background: "red",
            }} />
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