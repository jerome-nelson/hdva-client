import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";



interface MobileTableProps {
    className?: string;
    selectable?: boolean;
    head?: any[];
    cells?: any[];
    data: any[];
    showCols?: {
        onMobile?: number;
    };
}

// const SetRow: React.FC<{ isChecked: boolean; onSelect: any; row: any }> = ({ isChecked, row, onSelect }) => {
//     const [selected, setSelected] = useState(isChecked);

//     useEffect(() => {
//         onSelect(selected);
//     }, [onSelect, selected]);

//     const ChildC = row.collapsedTab;
//     return (
//         <CustomRow checked={selected} setChecked={setSelected} row={row}>
//             <ChildC checked={selected} setChecked={setSelected} pid={row.propertyId} link={encodeURI(`/properties/${encodeURIComponent(String(row.name).replace(" ", "-").toLowerCase())}`)} />
//         </CustomRow>
//     )
// }

// const CustomRow: React.FC<{ row: Record<string, any>; checked: boolean; setChecked: Dispatch<SetStateAction<any>>; }> = ({ checked, children, setChecked, row }) => {
//     const [collapsed, setCollapsed] = React.useState(false);
//     const history = useHistory();
//     const { user } = useContext(LoginContext);
//     const classes = useCustomTableStyles();

//     const lastUpdated = new Date(row.modifiedOn).toDateString();
//     const currentLink = encodeURI(`/properties/${encodeURIComponent(String(row.name).replace(" ", "-").toLowerCase())}`);
//     const generateLink = () => history.push(currentLink, { propertyId: row.propertyId });

//     // TODO: How to approach User typing without overriding
//     return user && (
//         <React.Fragment>
//             <TableRow
//                 className={classes.tableRow}
//                 role="checkbox"
//                 tabIndex={-1}
//                 key={row.name}
//                 hover>
//                 <Hidden only={["xs", "sm"]}>
//                     <TableCell padding="checkbox" onClick={() => setChecked(!checked)}>
//                         <Checkbox checked={checked} />
//                     </TableCell>
//                 </Hidden>
//                 <TableCell onClick={generateLink}>
//                     {row.image ? row.image : <NoImagePlaceholder thumbnail />}
//                 </TableCell>
//                 <Hidden only={["md", "lg", "xl"]}>
//                     <TableCell onClick={generateLink} colSpan={2} component="td" scope="row">
//                         {row.name}
//                     </TableCell>
//                 </Hidden>
//                 <Hidden only={["xs", "sm"]}>
//                     <TableCell component="td" scope="row">
//                         <Link
//                             className={classes.txtLink}
//                             to={{
//                                 state: {
//                                     lastUpdated,
//                                     propertyName: row.name,
//                                     propertyId: row.propertyId,
//                                     groupId: user.group
//                                 },
//                                 pathname: currentLink
//                             }}
//                         >
//                             {row.name}
//                         </Link>
//                     </TableCell>
//                     <TableCell component="td" scope="row">
//                         {lastUpdated}
//                     </TableCell>
//                     <TableCell>
//                         Test
//                         </TableCell>
//                     <TableCell>
//                         <Menu
//                             open={false}
//                             id="long-menu"
//                             keepMounted
//                         >
//                             {["Download all items"].map((option) => (<MenuItem key={option}>{option}</MenuItem>))}
//                         </Menu>
//                     </TableCell>
//                 </Hidden>
//                 {children && (
//                     <Hidden only={["md", "lg", "xl"]}>
//                         <TableCell>
//                             <IconButton aria-label="expand row" size="small" onClick={() => setCollapsed(!collapsed)}>
//                                 {collapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//                             </IconButton>
//                         </TableCell>
//                     </Hidden>
//                 )}

//             </TableRow>
//             {children && (
//                 <TableRow>
//                     <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//                         <Collapse in={collapsed} timeout="auto" unmountOnExit>
//                             <Box margin={1}>
//                                 {children}
//                             </Box>
//                         </Collapse>
//                     </TableCell>
//                 </TableRow>
//             )}
//         </React.Fragment>
//     );
// }

interface CustomRowProps {
    row: Record<string, any>;
    checked?: boolean;
    setChecked?: Dispatch<SetStateAction<any>>;
}

const CustomRow: React.FC<CustomRowProps> = ({ row, children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <React.Fragment>
            <TableRow>
                {children}
                {children && (
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setCollapsed(!collapsed)}>
                            {collapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                )}
            </TableRow>
            {row && (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={collapsed} timeout="auto" unmountOnExit>
                            <Box margin={1}>{row}</Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    )
}

interface SetRowProps {
    isChecked: boolean;
    onSelect(selected: boolean): void;
    row: Record<string, any>;
}

const SetRow: React.FC<SetRowProps> = ({ isChecked, onSelect, row }) => {
    const [selected, setSelected] = useState(isChecked);

    useEffect(() => {
        onSelect(selected);
    }, [onSelect, selected]);

    const data = useMemo(() => {
        return Object.keys(row).map(item => row[item]);
    }, [row]);

    const cells = useMemo(() => data.filter(cells => !cells.mobile).map(elem => elem.data), [data]);
    const collapsedCells = useMemo(() => data.filter(cells => cells.mobile).map(elem => elem.data), [data]);

    return (
        <CustomRow row={collapsedCells}>
            {cells.map((item, index) => (<TableCell key={`row-${index}`}>{item}</TableCell>))}
        </CustomRow>
    );
}

export const MobileTable: React.FC<MobileTableProps> = ({ data }) => {
    const [itemsSelected, setSelected] = useState<number[]>([]);
    return (
        <React.Fragment>
            <Table>
                <TableBody>
                    {data.map((row, rowIndex) => {
                        const key = itemsSelected.indexOf(rowIndex);
                        return (
                            <SetRow
                                key={`row-${rowIndex}`}
                                onSelect={selected => {
                                    const newItems = itemsSelected;

                                    if (!selected) {
                                        newItems.splice(key, 1);
                                        setSelected(newItems);
                                        return;
                                    }

                                    newItems.push(rowIndex);
                                    setSelected(newItems);
                                }}
                                row={row}
                                isChecked={Boolean(key > -1)}
                            />
                        )
                    })}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}