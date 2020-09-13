import React from "react";
import { Link, useHistory } from "react-router-dom";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, createStyles, makeStyles, Theme, CircularProgress, Button, Box, Grid, Card, CardActionArea, CardMedia, Typography, CardContent } from "@material-ui/core";
// import CameraIcon from '@material-ui/icons/Camera';
// import ImageIcon from '@material-ui/icons/Image';
// import ApartmentIcon from '@material-ui/icons/Apartment';

import { useAPI } from "hooks/useAPI";
import { messages } from "languages/en";
import { PropertyCard } from "components/property-card/property-card";
import { HeaderTitle } from "components/header/header";
import { getCurrentUser } from "services/auth.service";


interface Properties {
    createdOn: number;
    modifiedOn: number;
    name: string;
    propertyId: number;
    groupId: number;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            width: "80%",
            margin: `0 auto`
        },
        table: {
            width: "40%"
        },
        fullwidth: {
            textAlign: "center",
            width: "100%"
        },
        title: {
            marginTop: `${theme.spacing(3)}px`
        },
        subtitle: {
            width: '100%',
            fontFamily: `AtlasGrotesk, sans-serif`,
            borderBottom: `solid 1px rgba(0, 0, 0, 0.3)`,
            paddingBottom: `${theme.spacing(0.5)}px`,
            marginBottom: `${theme.spacing(1)}px`,
            '& h3': {
                margin: 0,
            },
        },
        media: {
            height: 140,
        },
        root: {
            maxWidth: 345,
            marginRight: '10px'
          },
    })
);

export const DashboardPage = () => {
    const user = getCurrentUser();
    const history = useHistory();

    if (!user) {
        history.push("/login");
    }

    const classes = useStyles();
    const [properties, _] = useAPI<Properties>(`http://localhost:3001/properties/${user.group}`);
    const [roles, roleNoop] = useAPI<Record<string, any>>(`http://localhost:3001/roles`);
    const [users, noop] = useAPI<Record<string, any>>(`http://localhost:3001/users`);
    // const [parsedUser, dispatch]= useReducer();
    return (
        <Box className={classes.container}>
            <HeaderTitle disableBack alignText="left" title="Dashboard" disableGutters />
            <Grid container className={classes.title}  alignItems="center">
                <Box className={classes.subtitle}>
                    <h3>{messages["dashboard.added-properties"]}</h3>
                </Box>
            </Grid>

            <Grid container>
                {properties.isLoading && <CircularProgress size="1.5rem" color="secondary" />}
                {!properties.isLoading && properties.data.slice(0, 3).sort((a, b) => a.modifiedOn - b.modifiedOn).map((row: any) => {
                    return <PropertyCard {...row} />
                })}
            </Grid>

        
            <h2>Current Users</h2>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th">Users In Group</TableCell>
                            <TableCell component="th">Email</TableCell>
                            <TableCell component="th">Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.isLoading && <CircularProgress size="1.5rem" color="secondary" />}
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
        </Box>
    )
}