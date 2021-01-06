/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Checkbox, Collapse, Hidden, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableRow, useTheme } from "@material-ui/core";
// TODO: Style better for no images
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { NoImagePlaceholder } from "components/carousel/carousel";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { getCurrentUser } from "services/auth.service";
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
    children: any;
    ariaList?: Record<string, unknown>;
    headers: Record<string, any>[];
    data: Record<string, any>[];
    user: Record<string, any>;
}

const SetRow: React.FC<{ isChecked: boolean; onSelect: any; row: any }> = ({ isChecked, row, onSelect }) => {
    const [selected, setSelected] = useState(isChecked);

    useEffect(() => {
        onSelect(selected);
    }, [selected]);

    const ChildC = row.collapsedTab;
    return (
        <CustomRow checked={selected} setChecked={setSelected} row={row}>
            <Hidden only={["md", "lg", "xl"]}>
                <ChildC checked={selected} setChecked={setSelected} pid={row.propertyId} link={encodeURI(`/properties/${encodeURIComponent(String(row.name).replace(" ", "-").toLowerCase())}`)} />
            </Hidden>
        </CustomRow>
    )
}

const CustomRow: React.FC<{ row: Record<string, any>; checked: boolean; setChecked: Dispatch<SetStateAction<any>>; }> = ({ checked, children, setChecked, row }) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const history = useHistory();
    const user = getCurrentUser();
    const classes = useCustomTableStyles();

    const lastUpdated = new Date(row.modifiedOn).toDateString();
    const currentLink = encodeURI(`/properties/${encodeURIComponent(String(row.name).replace(" ", "-").toLowerCase())}`);
    const generateLink = () => history.push(currentLink, { propertyId: row.propertyId });

    return (
        <React.Fragment>
            <TableRow
                className={classes.tableRow}
                role="checkbox"
                tabIndex={-1}
                key={row.name}
                hover>
                <Hidden only={["xs", "sm"]}>
                    <TableCell padding="checkbox" onClick={() => setChecked(!checked)}>
                        <Checkbox checked={checked} />
                    </TableCell>
                </Hidden>
                <TableCell onClick={generateLink}>
                    {row.image ? row.image : <NoImagePlaceholder thumbnail />}
                </TableCell>
                <Hidden only={["md", "lg", "xl"]}>
                    <TableCell onClick={generateLink} colSpan={2} component="td" scope="row">
                        {row.name}
                    </TableCell>
                </Hidden>
                <Hidden only={["xs", "sm"]}>
                    <TableCell component="td" scope="row">
                        <Link
                            className={classes.txtLink}
                            to={{
                                state: {
                                    lastUpdated,
                                    propertyName: row.name,
                                    propertyId: row.propertyId,
                                    groupId: user.group
                                },
                                pathname: currentLink
                            }}
                        >
                            {row.name}
                        </Link>
                    </TableCell>
                    <TableCell component="td" scope="row">
                        {lastUpdated}
                    </TableCell>
                    <TableCell>
                        Test
                        </TableCell>
                    <TableCell>
                        <Menu
                            open={false}
                            id="long-menu"
                            keepMounted
                        >
                            {["Download all items"].map((option) => (<MenuItem key={option}>{option}</MenuItem>))}
                        </Menu>
                    </TableCell>
                </Hidden>
                {children && (
                    <Hidden only={["md", "lg", "xl"]}>
                        <TableCell>
                            <IconButton aria-label="expand row" size="small" onClick={() => setCollapsed(!collapsed)}>
                                {collapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                    </Hidden>
                )}

            </TableRow>
            {children && (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={collapsed} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                {children}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
}

export const CustomTable: React.FC<CustomTableProps> = ({ ariaList, children, headers, data, user }) => {

    const theme = useTheme();
    const [rowCount, setRowCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('name');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const classes = useCustomTableStyles();
    const open = Boolean(anchorEl);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const isSelected = (name: string) => selectedRows.indexOf(name) !== -1;
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


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
        <React.Fragment>
            <Table className={classes.table} {...ariaList}>
                {/* <TableHead>
                    <TableRow>
                        <Hidden only={["xs", "sm"]}>
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
                        </Hidden>
                        {headers.map((headCell) => (
                            <Hidden only={headCell.hideOn}>
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
                            </Hidden>
                        ))}

                    </TableRow>
                </TableHead> */}
                <TableBody>
                    {stableSort(data, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: any) => {
                            return (
                                <SetRow
                                    onSelect={(select: boolean) => {
                                        let newRow = select ? [...selectedRows, row.propertyId] : selectedRows.filter(pid => pid != row.propertyId)
                                        setSelectedRows(newRow)
                                    }}
                                    row={row}
                                    isChecked={selectedRows.includes(row.propertyId)}
                                />
                            );
                        })}
                </TableBody>
            </Table>
            {children && children(selectedRows)}
        </React.Fragment>
    )
}