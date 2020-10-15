import React, { useState } from "react";
import { Link } from "react-router-dom";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PermMediaTwoToneIcon from '@material-ui/icons/PermMediaTwoTone';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, TableFooter, TablePagination, IconButton,  MenuItem, Menu, Checkbox, Box, TableSortLabel } from "@material-ui/core";

import { useCustomTableStyles } from "./custom-table.styles";

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface CustomTableProps {
    children?: React.ReactNode;
    headers:  Record<string, any>[];
    data: Record<string, any>[];
    user: Record<string, any>;
}

export const CustomTable: React.FC<CustomTableProps> = ({ children, headers, data, user }) => {
 
    const [rowCount, setRowCount] = useState(0);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('name');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const classes = useCustomTableStyles();

 
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const isSelected = (name: string) => selectedRows.indexOf(name) !== -1;
    const onSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked && data.length > 0) {
            const newSelecteds = data.map((n) => n.name);
            setSelectedRows(newSelecteds);
            return;
        }
        setSelectedRows([]);
    };

    const handleRowClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selectedRows.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRows, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelected = newSelected.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1),
            );
        }

        setSelectedRows(newSelected);
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        handleRequestSort(event, property);
    };

    return (
        <TableContainer>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell
                        className={`${classes.tableCell} ${classes.tableCellFirst}`}
                        component="th"
                        padding="checkbox"

                    >
                        <Checkbox
                            checked={selectedRows.length > 0}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all properties' }}
                        />
                    </TableCell>
                    {headers.map((headCell) => {
                        return (
                            <TableCell
                                key={headCell.id}
                                className={`${classes.tableCell} ${headCell.extraClasses}`}
                                align={headCell.numeric ? 'right' : 'left'}
                                padding={headCell.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <span className={classes.visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {stableSort(data, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, index) => {
                        const isItemSelected = isSelected(row.name);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                            <TableRow
                                className={classes.tableRow}
                                onClick={(event) => handleRowClick(event, row.name)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.name}
                                selected={isItemSelected}
                                hover>
                                <TableCell padding="checkbox" className={`${classes.tableCell} ${classes.tableCellFirst}`}>
                                    <Checkbox
                                        checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </TableCell>
                                <TableCell className={`${classes.folder} ${classes.tableCell}`}>
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
                                        { row.image ? row.image : <PermMediaTwoToneIcon fontSize="large" color="action" />}
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
                            </TableRow>);
                    })}
            </TableBody>
        </Table>
        {children}
    </TableContainer>
    )
}