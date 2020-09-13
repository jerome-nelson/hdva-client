import React from "react";
import { Link, useHistory } from "react-router-dom";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, createStyles, makeStyles, Theme, CircularProgress, Button, TableFooter, TablePagination, IconButton, useTheme } from "@material-ui/core";
import { useAPI } from "../../hooks/useAPI";

import { HeaderTitle } from "../../components/header/header";
import { getCurrentUser } from "../../services/auth.service";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            width: "40%"
        },
        fullwidth: {
            textAlign: "center",
            width: "100%"
        }
    }));

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}
const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);
function TablePaginationActions(props: TablePaginationActionsProps) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}


export const PropertiesOverviewPage = () => {
    const user = getCurrentUser();
    const history = useHistory();

    if (!user) {
        history.push("/login");
    }

    const classes = useStyles();
    const [properties, _] = useAPI<Record<string, any>>(`http://localhost:3001/properties/${user.group}`);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, properties.data.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <React.Fragment>
            <HeaderTitle disableBack title="All Properties" />
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th">Properties</TableCell>
                            <TableCell component="th">Last Updated</TableCell>
                            {/* <TableCell component="th" align="right">&nbsp;</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties.isLoading && <CircularProgress size="1.5rem" color="secondary" />}
                        {!properties.isLoading && properties.data.map((row: any) => (
                            <TableRow key={row.name}>
                                <TableCell className={classes.table} component="td" scope="row">
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
                                    >{row.name}
                                    </Link>
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {new Date(row.modifiedOn).toDateString()}
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
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={properties.data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}