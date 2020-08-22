import React from "react";
import { Link } from "react-router-dom";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, createStyles, makeStyles, Theme, CircularProgress } from "@material-ui/core";
import CameraIcon from '@material-ui/icons/Camera';
import ImageIcon from '@material-ui/icons/Image';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { useAPI } from "../../utils/getData";

import { HeaderTitle } from "components/header/header";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            width: "40%"
        },
    })
);

export const DashboardPage = () => {

    const classes = useStyles();
    const [properties, _] = useAPI<Record<string, any>>("http://localhost:3001/properties/");
    return (
        <React.Fragment>
            <HeaderTitle disableBack title="Dashboard" />
            <h2>Available Downloads</h2>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th">Properties</TableCell>
                            <TableCell component="th" align="right">Last Changed</TableCell>
                            <TableCell component="th" align="right">Date Added</TableCell>
                            {/* <TableCell component="th" align="right">&nbsp;</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties.isLoading && <CircularProgress size="1.5rem" color="secondary" />}
                        {!properties.isLoading && properties.data.map((row: any) => (
                            <TableRow key={row.name}>

                                <TableCell className={classes.table} component="td" scope="row">
                                    <Link to={encodeURI(`/properties/${encodeURIComponent(String(row.name).replace(" ", "-").toLowerCase())}`)}>{row.name}</Link>
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {new Date(row.modifiedOn).toDateString()}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {new Date(row.createdOn).toDateString()}
                                </TableCell>
                                {/* <TableCell component="td" scope="row">
                                    <Link to={encodeURI(`/properties/${row.propertyId.toLowerCase()}`)}>
                                        {row.hasFloorplan && (<ApartmentIcon />)}

                                        {row.hasVT && (<CameraIcon />)}
                                        {row.hasImages && (<ImageIcon />)}
                                    </Link>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}