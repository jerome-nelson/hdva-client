import { Collapse, IconButton, Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";



interface MobileTableProps {
    className?: string;
    cellStyles?: Record<string, any>[];
    selectable?: boolean;
    data: any[];
}

interface CustomRowProps {
    row: Record<string, any>;
    checked?: boolean;
    selected?: boolean;
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
                    <TableCell style={{ padding: 0 }} colSpan={6}>
                        <Collapse in={collapsed} timeout="auto" unmountOnExit>
                            {row}
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
    styles?: Record<string, any>[];
    row: Record<string, any>;
}

const SetRow: React.FC<SetRowProps> = ({ isChecked, onSelect, row, styles }) => {
    const [selected] = useState(isChecked);

    useEffect(() => {
        onSelect(selected);
        
    }, [onSelect]);

    const data = useMemo(() => {
        return Object.keys(row).map(item => row[item]);
    }, [row]);

    const cells = useMemo(() => data.filter(cells => !cells.mobile && !cells.hideOnMobile).map(elem => elem.data), [data]);
    const collapsedCells = useMemo(() => data.filter(cells => cells.mobile).map(elem => elem.data), [data]);

    return (
        <CustomRow selected={selected} row={collapsedCells}>
            {cells.map((item, index) => {
                const className = (styles && styles[index] && styles[index].className) || "";
                return <TableCell key={`row-${index}`} className={className}>{item}</TableCell>
            })}
        </CustomRow>
    );
}

export const MobileTable: React.FC<MobileTableProps> = ({ data, cellStyles }) => {
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
                                styles={cellStyles}
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