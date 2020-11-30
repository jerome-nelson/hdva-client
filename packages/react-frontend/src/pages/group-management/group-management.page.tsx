import { Box, Button, CircularProgress, Grid, Hidden, OutlinedInput, Paper } from "@material-ui/core";
import { CustomTable } from "components/table/custom-table";
import { useAPI } from "hooks/useAPI";
import { messages } from "languages/en";
import React from "react";
import { getCurrentUser } from "services/auth.service";
import { useGenericStyle } from "utils/generic.style";
import { HeaderTitle } from "../../components/header/header";
import { useGroupStyle } from "./group-management.page.style";


interface Groups {
    createdOn: Date;
    description?: string;
    modifiedOn: Date;
    name: string;
    groupId: number;
    _id: string;
}

export const GroupPage: React.FC = () => {
    // const [currentRole] = useRoles();
    const user = getCurrentUser();
    // const gid = [Roles.admin, Roles.super].includes(currentRole) ? `` : `/${user.group}`;
    // TODO: Limit user groups
    const [groups] = useAPI<Groups>(`/groups`, {
        extraHeaders: {
            'Authorization': user.token
        }
    });
    const classes = useGroupStyle();
    const genericClasses = useGenericStyle();

    const { data } = groups;

    const headCells: Record<string, unknown>[] = [
        { id: 'icon', label: 'Name' },
        { id: 'name', numeric: false, disablePadding: false, label: "" },
        { id: 'description', numeric: false, disablePadding: false, label: "" },
    ];

    return (
        <Box>
            <HeaderTitle disableBack alignText="left" title="Group Management" disableGutters />
            <Grid container>
                {
                    groups.isLoading ?
                        <CircularProgress size="1.5rem" color="secondary" /> :
                        <React.Fragment>
                            <Grid container alignItems="center">
                                <Box>
                                    <h3>{messages["group-management.group.add.header"]}</h3>
                                </Box>

                                <Grid item xs={12}>
                                    <Paper>
                                        <form
                                            className={classes.groupForm}
                                            onSubmit={event => {
                                                event.preventDefault();
                                                // setValues(values);
                                                // setIsLoading(true);

                                                // // UX Change - delayed on purpose
                                                // setTimeout(() => {
                                                //     callAPI({
                                                //         name: values.username,
                                                //         description: values.password
                                                //     })
                                                //     setIsLoading(false);
                                                // }, 3000);
                                            }}
                                            autoComplete="off"
                                        >
                                            <OutlinedInput
                                                className={genericClasses.userFields}
                                                fullWidth={true}
                                                placeholder={messages["group.form.title"]}
                                                id="title"
                                                type="text"
                                            />
                                            <OutlinedInput
                                                className={genericClasses.userFields}
                                                fullWidth={true}
                                                placeholder={messages["group.form.description"]}
                                                id="description"
                                                type="text"
                                            />
                                            <Button type="submit" className={genericClasses.actionButton} fullWidth size="large" variant="outlined" color="primary">
                                                {messages["button.group.add"]}
                                               </Button>
                                        </form>
                                    </Paper>
                                </Grid>
                            </Grid>
                            {(
                                groups.noData ?
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
            </Grid>
        </Box>
    );
}