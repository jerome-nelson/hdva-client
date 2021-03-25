import { Checkbox, createStyles, makeStyles, TableBody, TableCell, TableHead, TableRow, Theme } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { COLOR_OVERRIDES } from 'theme';

interface GenericTableProps {
    color?: 'primary' | 'secondary';
    className?: string;
    onSelect?(items: number[]): void;
    selectable?: boolean;
    head?: any[];
    cells: any[];
    data: any[];
    mini?: boolean;
    showCols?: {
        onMobile?: number;
    };
}

export const useGenericTableStyles = makeStyles<Theme, Partial<GenericTableProps>>((theme: Theme) => (
    createStyles({
        secondary: {
            borderColor: `rgba(0,0,0, 0.23)`,
            color: COLOR_OVERRIDES.hdva_black
        },
        mini: {
            padding: `${theme.spacing(0.5)}px`,
            fontSize: `0.9rem`
        },
        cellStyle: {
            "tr > & ~ &": {
                borderLeftColor: `transparent`
            },
        },
        hideCheckbox: {
            // TODO: TEMPORARY UNTIL CAN FIX ALIGNMENT
            display: `none`,
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


export const GenericTable: React.FC<GenericTableProps> = ({ color, className, mini, head, selectable, cells, data, onSelect }) => {

    const classes = useGenericTableStyles({ mini });
    const [itemsSelected, setSelected] = useState<number[]>([]);
    const [, setToggle] = useState<number | null>(null);

    const indeterminate = React.useMemo(
        () => itemsSelected.length > 0 && itemsSelected.length !== data.length,
        [data, itemsSelected]
    );

    useEffect(() => {
        if (onSelect) {
            onSelect(itemsSelected);
        }
        
    }, [itemsSelected]);

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
                                classes={{
                                    root: mini ? classes.mini : ""
                                }}
                                className={classNames({
                                    [classes.noBg]: true,
                                    [classes.hideCheckbox]: true,
                                    [classes.secondary]: color === "secondary"
                                })}
                                padding="checkbox"
                            >
                                <Checkbox
                                    className={classNames({
                                        // [classes.hideCheckbox]: !indeterminate && !(itemsSelected.length === data.length)
                                        [classes.hideCheckbox]: true
                                    })}
                                    onChange={({ target: { checked } }) => headerSelect(checked)}
                                    checked={!indeterminate}
                                    indeterminate={indeterminate}
                                />
                            </TableCell>
                        )}
                        {(head || []).filter(head => !Boolean(head.hide))
                            .map(({ name, ...rest }, key) => <TableCell key={`${name}-${key}`} {...rest}>{name}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => {
                        const isItemSelected = itemsSelected.includes(rowIndex);
                        // const shouldHideCheckbox = !isItemSelected && !indeterminate && (toggleCheckbox !== rowIndex && toggleCheckbox !== -1);
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
                                        classes={{
                                            root: mini ? classes.mini : ""
                                        }}
                                        className={classNames({
                                            [classes.noBg]: true,
                                            [classes.hideCheckbox]: true,
                                            [classes.secondary]: color === "secondary"
                                        })}
                                        padding="checkbox"
                                    >
                                        <Checkbox
                                            className={classNames({
                                                // [classes.hideCheckbox]: shouldHideCheckbox 
                                                [classes.hideCheckbox]: true
                                            })}
                                            checked={isItemSelected}
                                            onChange={({ target: { checked } }) => rowSelect(checked, rowIndex)}
                                        />
                                    </TableCell>
                                )}
                                {Object.keys(row).map((item, index) => {
                                    return !Boolean(row[item].hide) && (
                                        <TableCell
                                            key={`cell-${index}`}
                                            {...cells[index]}
                                            classes={{
                                                root: mini ? classes.mini : ""
                                            }}
                                            className={classNames({
                                                ...(cells[index] && cells[index].className ? { [cells[index].className]: true } : null),
                                                [classes.cellStyle]: true,
                                                [classes.trSelected]: isItemSelected,
                                                [classes.secondary]: color === "secondary"
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