import { Checkbox, createStyles, makeStyles, TableBody, TableCell, TableHead, TableRow, Theme } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import classNames from "classnames";
import React, { useState } from "react";
import { COLOR_OVERRIDES } from 'theme';

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
        cellStyle: {
            borderLeft: `2px solid ${COLOR_OVERRIDES.hdva_black_bg}`,
            "tr > & ~ &": {
                borderLeftColor: `transparent`
            },
        },
        hideCheckbox: {
            visibility: `hidden`
        },
        noBg: {
            borderBottomColor: "transparent"
        },
        trSelected: {
            borderLeftColor: `${COLOR_OVERRIDES.hdva_red}`,
            background: `rgba(255, 255, 255, 0.08)`,
            "tr > & ~ &": {
                borderLeftColor: `transparent`
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
        const newItems = ([] as number[]).concat(itemsSelected);
        newItems.splice(key, 1);
        if (key > -1) {
            setSelected(newItems);
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
                                        [classes.hideCheckbox]: !indeterminate && !(itemsSelected.length === data.length)
                                    })}
                                    onChange={({ target: { checked } }) => headerSelect(checked)}
                                    checked={!indeterminate}
                                    indeterminate={indeterminate}
                                />
                            </TableCell>
                        )}
                        {head.map(({ name, ...rest }, key) => <TableCell key={`${name}-${key}`} {...rest}>{name}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => {
                        const isItemSelected = itemsSelected.includes(rowIndex);
                        const shouldHideCheckbox = !isItemSelected && !indeterminate && (toggleCheckbox !== rowIndex && toggleCheckbox !== -1);
                        return (
                            <TableRow
                                key={`row-${rowIndex}`}
                                hover={selectable}
                                onClick={() => rowSelect(!isItemSelected, rowIndex)}
                            >
                                {selectable && (
                                    <TableCell
                                        onMouseOver={() => setToggle(rowIndex)}
                                        onMouseOut={() => setToggle(null)}
                                        className={classes.noBg}
                                        padding="checkbox"
                                    >
                                        <Checkbox
                                            className={classNames({ [classes.hideCheckbox]: shouldHideCheckbox })}
                                            checked={isItemSelected}
                                            onChange={({ target: { checked } }) => rowSelect(checked, rowIndex)}
                                        />
                                    </TableCell>
                                )}
                                {Object.keys(row).map((item, index) => {
                                    return (
                                        <TableCell
                                            key={`cell-${index}`}
                                            {...cells[index]}
                                            className={classNames({
                                                [cells[index].className]: true,
                                                [classes.cellStyle]: true,
                                                [classes.trSelected]: isItemSelected
                                            })}
                                        >
                                            {row[item].data}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}