import { Box, Button, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import GroupIcon from '@material-ui/icons/Group';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import { PropertyCard } from "components/property-card/property-card";
import { messages } from "config/en";
import { useAPI } from "hooks/useAPI";
import { Roles, useRoles } from "hooks/useRoles";
import React from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "services/auth.service";
import { STYLE_OVERRIDES } from "theme";
import { useGenericStyle } from "utils/generic.style";
import { CarouselContainer } from "../../components/carousel/carousel";
import { Placeholder } from "../../components/placeholder/placeholder";
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
    const propertiesSuffix = !!user.group && user.group !== 1 ? `/${user.group}` : ``;
    const classes = useDashboardStyles();
    const genericStyles = useGenericStyle();
    const [properties,] = useAPI<Properties>(`/properties${propertiesSuffix}`, {
        extraHeaders: {
            'Authorization': user.token
        }
    });
    const [users,] = useAPI<Record<string, any>>(`/users`, {
        extraHeaders: {
            'Authorization': user.token
        }
    });

    const { data: propertyData } = properties;
    const { data: userData, noData: noUsers } = users;
    const [currentRole] = useRoles();

    return (
        <React.Fragment>
            <Grid container className={classes.title} alignItems="center">
                <Box className={classes.subtitle}>
                    <h3>{messages["dashboard.added-properties"]}</h3>
                </Box>
            </Grid>

            {properties.isLoading && <CircularProgress size="1.5rem" color="secondary" />}
            {!properties.isLoading && properties.noData ? (
                <Placeholder
                    subtitle={messages["placeholder.properties.subtitle"]}
                    title={messages["placeholder.properties.title"]}
                >
                    <HomeWorkIcon />
                </Placeholder>
            ) : (
                    <React.Fragment>
                        <CarouselContainer>
                            {propertyData
                                .slice(0, 3)
                                .sort((a, b) => a.modifiedOn - b.modifiedOn)
                                .map((row: any) => (
                                    <PropertyCard
                                        itemWidth={`${STYLE_OVERRIDES.carousel.itemWidth}px`}
                                        {...row}
                                    />
                                ))}
                        </CarouselContainer>
                    </React.Fragment>
                )}
            {/* TODO: Replace <Link><Button> */}
            <Link to={"/properties"} className={classes.linkStyle}>
                <Button fullWidth size="small" variant="outlined" color="primary">
                    More Properties
                    </Button>
            </Link>
            <Box className={classes.container}>


                <h3>Group Users</h3>
                {!noUsers && (<TableContainer component={Paper}>
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
                            {userData.map((row: any) => (
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
                </TableContainer>)}
                {noUsers && (
                    <Placeholder
                        subtitle={messages["placeholder.users.subtitle"]}
                        title={messages["placeholder.users.title"]}
                    >
                        <GroupIcon />
                    </Placeholder>
                )}
                {(Roles.viewer !== currentRole) &&
                    <Link to={"/user-management"} className={classes.linkStyle}>
                        <Button className={genericStyles.actionButton} fullWidth size="large" variant="outlined" color="primary">
                            Add a new user
                    </Button>
                    </Link>
                }
            </Box>
        </React.Fragment>
    )
}