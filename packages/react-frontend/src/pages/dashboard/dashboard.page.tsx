import React from "react";
import { Link, useHistory } from "react-router-dom";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button, Box, Grid, Card, CardActionArea, CardMedia, Typography, CardContent } from "@material-ui/core";

import { useAPI } from "hooks/useAPI";
import { Roles, useRoles } from "hooks/useRoles";
import { messages } from "languages/en";
import { PropertyCard } from "components/property-card/property-card";
import { HeaderTitle } from "components/header/header";
import { getCurrentUser } from "services/auth.service";

import { useDashboardStyles } from "./dashboard.page.style";

interface Properties {
    createdOn: number;
    modifiedOn: number;
    name: string;
    propertyId: number;
    groupId: number;
}



export const DashboardPage = () => {
    const user = getCurrentUser();
    const history = useHistory();
    const propertiesSuffix = !!user.group && user.group !== 1 ? `/${user.group}` : ``;
    const classes = useDashboardStyles();
    const [properties,] = useAPI<Properties>(`http://localhost:3001/properties${propertiesSuffix}`, {
        extraHeaders: {
            'Authorization': user.token
        }
    });
    const [users,] = useAPI<Record<string, any>>(`http://localhost:3001/users`, {
        extraHeaders: {
            'Authorization': user.token
        }
    });
    const [currentRole] = useRoles();

    return (
        <Box className={classes.container}>
            {currentRole}
            <HeaderTitle disableBack alignText="left" title="Dashboard" disableGutters />
            <Grid container className={classes.title} alignItems="center">
                <Box className={classes.subtitle}>
                    <h3>{messages["dashboard.added-properties"]}</h3>
                </Box>
            </Grid>

            <Grid container>
                {properties.isLoading ? <CircularProgress size="1.5rem" color="secondary" /> : properties.data.slice(0, 3).sort((a, b) => a.modifiedOn - b.modifiedOn).map((row: any) => {
                    return <PropertyCard {...row} />
                })}
                <Link to={"/properties"} className={classes.linkStyle}>
                    <Button className={classes.actionBtn} fullWidth size="large" variant="outlined" color="primary">
                        More Properties
                 </Button>
                </Link>
            </Grid>

            <h2>Group Users</h2>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th">Users In Group</TableCell>
                            <TableCell component="th">Email</TableCell>
                            <TableCell component="th">Role</TableCell>
                            <TableCell component="th">Date Created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.isLoading && <CircularProgress size="1.5rem" color="secondary" />}
                        {/* TODO: Remove user from array */}
                        {!users.isLoading && users.data.map((row: any) => (
                            <TableRow key={row.name}>
                                <TableCell component="td" scope="row">{row.name}</TableCell>
                                <TableCell component="td" scope="row">{row.email}</TableCell>
                                <TableCell component="td" scope="row">{row.role}</TableCell>
                                <TableCell component="td" scope="row">
                                    {new Date(row.modifiedOn).toDateString()}
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
            {(Roles.viewer !== currentRole) &&
                <Link to={"/properties"} className={classes.linkStyle}>
                    <Button className={classes.actionBtn} fullWidth size="large" variant="outlined" color="primary">
                        Add a new user
                    </Button>
                </Link>
            }
        </Box>
    )
}