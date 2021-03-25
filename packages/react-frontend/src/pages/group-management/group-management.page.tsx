import { Box, Breadcrumbs, Hidden, Link } from "@material-ui/core";
import { messages } from "config/en";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import React from "react";
import { HeaderTitle } from "../../components/header/header";
import { useGroupStyle } from "./group-management.page.style";


export interface Groups {
    createdOn: Date;
    description?: string;
    modifiedOn: Date;
    name: string;
    groupId: string;
    _id: string;
}

const GroupPage: React.FC = () => {
    // const { user } = useContext(LoginContext);
    // const { data: groups, isLoading } = useQuery({
    //     queryKey: "groups",
    //     queryFn: () => getAPI<Groups>(`/groups`, { token: user && user.token })
    // });
    const classes = useGroupStyle();
    // const genericClasses = useGenericStyle();
    // const headCells: Record<string, unknown>[] = [
    //     { id: 'icon', label: 'Name' },
    //     { id: 'name', numeric: false, disablePadding: false, label: "" },
    //     { id: 'description', numeric: false, disablePadding: false, label: "" },
    // ];

    return (
        <Box>
            <Hidden mdDown>
                {/* TODO: Make generic component */}
                <Breadcrumbs className={classes.breadcrumb} separator="›" aria-label="breadcrumb">
                    <Link color="textSecondary" href="/" onClick={() => { }} className={classes.link}>
                        <FolderSVG className={classes.icon} /> HDVA
                </Link>
                    <Link color="secondary" onClick={() => { }} className={classes.link}>{messages["group-management.title"]}</Link>
                </Breadcrumbs>
            </Hidden>
            <Hidden mdUp>
                <HeaderTitle isFixed alignText="center" color="primary" variant="h5" title={messages["group-management.title"]} />
            </Hidden>
        </Box>
        // <Box>
        //     <Hidden mdUp>
        //         <HeaderTitle isFixed title={messages["group-management.title"]} />
        //     </Hidden>
        //     <Hidden mdDown>
        //         <HeaderTitle disableBack alignText="left" title={messages["group-management.title"]} disableGutters />
        //     </Hidden>
        //     <Grid container>
        //         {
        //             isLoading ?
        //                 <CircularProgress size="1.5rem" color="secondary" /> :
        //                 <React.Fragment>
        //                     <Grid container alignItems="center">
        //                         <Box>
        //                             <h3>{messages["group-management.group.add.header"]}</h3>
        //                         </Box>

        //                         <Grid item xs={12}>
        //                             <Paper>
        //                                 <form
        //                                     className={classes.groupForm}
        //                                     onSubmit={event => {
        //                                         event.preventDefault();
        //                                         // setValues(values);
        //                                         // setIsLoading(true);

        //                                         // // UX Change - delayed on purpose
        //                                         // setTimeout(() => {
        //                                         //     callAPI({
        //                                         //         name: values.username,
        //                                         //         description: values.password
        //                                         //     })
        //                                         //     setIsLoading(false);
        //                                         // }, 3000);
        //                                     }}
        //                                     autoComplete="off"
        //                                 >
        //                                     <OutlinedInput
        //                                         className={genericClasses.userFields}
        //                                         fullWidth={true}
        //                                         placeholder={messages["group.form.title"]}
        //                                         id="title"
        //                                         type="text"
        //                                     />
        //                                     <OutlinedInput
        //                                         className={genericClasses.userFields}
        //                                         fullWidth={true}
        //                                         placeholder={messages["group.form.description"]}
        //                                         id="description"
        //                                         type="text"
        //                                     />
        //                                     <Button type="submit" className={genericClasses.actionButton} fullWidth size="large" variant="outlined" color="primary">
        //                                         {messages["button.group.add"]}
        //                                        </Button>
        //                                 </form>
        //                             </Paper>
        //                         </Grid>
        //                     </Grid>
        //                     {(
        //                         groups && groups.length <= 0 ?
        //                             (
        //                                 "no dataaa"
        //                             ) :
        //                             <Grid container alignItems="center">
        //                                 <Box>
        //                                     <h3>{messages["groups-management.list"]}</h3>
        //                                 </Box>
        //                                 {/* <CustomTable user={user} headers={headCells} data={data}>
        //                                     {(hasSelected: string[] | undefined) => (
        //                                         <React.Fragment>
        //                                             <Hidden only={["md", "lg", "xl"]}>
        //                                                 <Button
        //                                                     onClick={() => alert(`Should delete selected:  ${hasSelected && hasSelected.join(",")}`)}
        //                                                     fullWidth
        //                                                     className={genericClasses.actionButton}
        //                                                     disabled={!hasSelected || (hasSelected && hasSelected.length <= 0)}
        //                                                     size="large" variant="outlined" color="primary"
        //                                                 >
        //                                                     {messages["button.delete"]}
        //                                                 </Button>
        //                                             </Hidden>
        //                                             <Hidden only={["xs", "sm"]}>
        //                                                 <Grid container xs={10} spacing={1}>
        //                                                     <Grid item>
        //                                                         <Button
        //                                                             onClick={() => alert(`Should delete properties from pids:  ${hasSelected && hasSelected.join(",")}`)}
        //                                                             fullWidth
        //                                                             className={genericClasses.actionButton}
        //                                                             disabled={!hasSelected || (hasSelected && hasSelected.length <= 0)}
        //                                                             size="medium" variant="outlined" color="primary"
        //                                                         >
        //                                                             {messages["button.delete"]}
        //                                                         </Button>
        //                                                     </Grid>
        //                                                 </Grid>
        //                                             </Hidden>
        //                                         </React.Fragment>
        //                                     )}
        //                                 </CustomTable> */}
        //                             </Grid>
        //                     )}
        //                 </React.Fragment>
        //         }
        //     </Grid>
        // </Box>
    );
}

export default GroupPage;