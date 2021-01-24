import { Checkbox, createStyles, makeStyles, TableBody, TableCell, TableHead, TableRow, Theme } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import classNames from "classnames";
import React, { useState } from "react";

interface GenericTableProps {
    className?: string;
    selectable?: boolean;
    head: any[];
    cells: any[];
    data: any[];
    showCols?: {
        onMobile?: number;
    };
}

export const useGenericTableStyles = makeStyles((theme: Theme) => (
    createStyles({
        hideCheckbox: {
            visibility: `hidden`
        },
        noBg: {
            borderBottomColor: "transparent"
        },
        trSelected: {
            borderLeft: `2px solid red`,
            background: `rgba(255, 255, 255, 0.08)`,
            "tr > & ~ &": {
                borderLeft: "none"
            },
        },
    })
));


export const GenericTable: React.FC<GenericTableProps> = ({ className, head, selectable, cells, data }) => {

    const classes = useGenericTableStyles();
    const [itemsSelected, setSelected] = useState<number[]>([]);
    const [toggleCheckbox, setToggle] = useState<number | null>(null);

    const indeterminate = React.useMemo(
        () => itemsSelected.length > 0 && itemsSelected.length !== data.length,
        [data, itemsSelected]
    );

    const headerSelect = (checked: boolean) => {
        if (checked) {
            const newState = [];
            for (let i = 0; i < data.length; i += 1) {
                newState.push(i);
            }
            setSelected(newState);
            setToggle(-1);
            return;
        }
        setSelected([]);
    }

    const rowSelect = (checked: boolean, index: number) => {
        if (checked) {
            setSelected(itemsSelected.concat([index]));
            return;
        }
        const key = itemsSelected.findIndex(item => item === index);
        if (key > -1) {
            setSelected(itemsSelected.slice(0, key - 1).concat(itemsSelected.slice(key + 1)))
        }
    }

    return (
        <TableContainer className={className}>
            <Table>
                <TableHead>
                    <TableRow>
                        {selectable && (
                            <TableCell
                                onMouseOver={() => setToggle(-1)}
                                onMouseOut={() => setToggle(null)}
                                className={classes.noBg}
                                padding="checkbox"
                            >
                                <Checkbox
                                    className={classNames({
                                        [classes.hideCheckbox]: !indeterminate && !toggleCheckbox
                                    })}
                                    onChange={({ target: { checked } }) => headerSelect(checked)}
                                    indeterminate={indeterminate}
                                />
                            </TableCell>
                        )}
                        {head.map(({ name, ...rest }) => <TableCell {...rest}>{name}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => {
                        const isItemSelected = itemsSelected.includes(rowIndex);
                        return (
                            <TableRow hover={selectable}>
                                {selectable && (
                                    <TableCell
                                        onMouseOver={() => setToggle(rowIndex)}
                                        onMouseOut={() => setToggle(null)}
                                        className={classes.noBg}
                                        padding="checkbox"
                                    >
                                        <Checkbox
                                            className={classNames({
                                                [classes.hideCheckbox]: toggleCheckbox !== -1 || (!indeterminate && toggleCheckbox !== rowIndex)
                                            })}
                                            checked={isItemSelected}
                                            onChange={({ target: { checked } }) => rowSelect(checked, rowIndex)}
                                        />
                                    </TableCell>
                                )}
                                {Object.keys(row).map((item, index) => (
                                    <TableCell
                                        {...cells[index]}
                                        className={classNames({
                                            [cells[index].className]: true,
                                            [classes.trSelected]: isItemSelected
                                        })}
                                    >
                                        {row[item]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}