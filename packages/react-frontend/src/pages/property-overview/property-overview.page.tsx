import React from "react";
import { Link, useHistory } from "react-router-dom";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PermMediaTwoToneIcon from '@material-ui/icons/PermMediaTwoTone';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, createStyles, makeStyles, Theme, CircularProgress, Button, TableFooter, TablePagination, IconButton, useTheme, Hidden, MenuItem, Menu } from "@material-ui/core";
import { useAPI } from "../../hooks/useAPI";

import { HeaderTitle } from "../../components/header/header";
import { getCurrentUser } from "../../services/auth.service";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            width: "90%",
        },
        tableCell: {
            padding: "8px 4px",
        },
        tableCellFirst: {
            paddingLeft: "8px"
        },
        tableCellEnd: {
            paddingRight: "8px"
        },
        folder: {
            width: "1%"
        },
        txtLink: {
            color: "#000",
            display: "block",
            textDecoration: "none"
        },
        name: {
            width: "40%"
        },
        fullwidth: {
            textAlign: "center",
            width: "100%"
        }
    })
);

export const PropertiesOverviewPage = () => {
    const user = getCurrentUser();
    const history = useHistory();

    if (!user) {
        history.push("/login");
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const classes = useStyles();
    const propertiesSuffix = !!user.group && user.group !== 1 ? `/${user.group}` : ``;    
    const [properties,] = useAPI<Record<string, any>>(`http://localhost:3001/properties${propertiesSuffix}`);

    return (
        <React.Fragment>
            <Hidden mdUp>
                <HeaderTitle disableBack title="All Properties" />
            </Hidden>
            <Hidden mdDown>
                <HeaderTitle disableBack alignText="left" title="Properties" disableGutters />
            </Hidden>
            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={`${classes.tableCell} ${classes.tableCellFirst}`} component="th">Name</TableCell>
                            <TableCell className={classes.tableCell} component="th">&nbsp;</TableCell>
                            <TableCell className={classes.tableCell} component="th">Modified</TableCell>
                            <TableCell className={classes.tableCell} component="th">Viewable by</TableCell>
                            <TableCell className={`${classes.tableCell} ${classes.tableCellEnd}`} component="th" align="right">&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties.isLoading ? <CircularProgress size="1.5rem" color="secondary" /> : properties.data.map((row: any) => (
                            <TableRow key={row.name} hover>
                                <TableCell className={`${classes.folder} ${classes.tableCell} ${classes.tableCellFirst}`}>
                                    <Link
                                        to={{
                                            state: {
                                                lastUpdated: new Date(row.modifiedOn).toDateString(),
                                                propertyName: row.name,
                                                propertyId: row.propertyId,
                                                groupId: user.group
                                            },
                                            pathname: encodeURI(`/properties/${encodeURIComponent(String(row.name).replace(" ", "-").toLowerCase())}`)
                                        }}
                                    >
                                        <PermMediaTwoToneIcon fontSize="large" color="action" />
                                    </Link>
                                </TableCell>
                                <TableCell className={`${classes.name} ${classes.tableCell}`} component="td" scope="row">
                                    <Link
                                    className={classes.txtLink}
                                        to={{
                                            state: {
                                                lastUpdated: new Date(row.modifiedOn).toDateString(),
                                                propertyName: row.name,
                                                propertyId: row.propertyId,
                                                groupId: user.group
                                            },
                                            pathname: encodeURI(`/properties/${encodeURIComponent(String(row.name).replace(" ", "-").toLowerCase())}`)
                                        }}
                                    >
                                        {row.name}
                                    </Link>
                                </TableCell>
                                <TableCell className={classes.tableCell} component="td" scope="row">
                                    {new Date(row.modifiedOn).toDateString()}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    Test
                                </TableCell>
                                <TableCell className={`${classes.tableCell} ${classes.tableCellEnd}`}>
                                    <IconButton
                                        aria-label="more"
                                        aria-controls="long-menu"
                                        aria-haspopup="true"
                                        onClick={handleClick}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="long-menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        {["Download all items"].map((option) => (
                                            <MenuItem key={option} onClick={handleClose}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}
// TODO: Add pagination