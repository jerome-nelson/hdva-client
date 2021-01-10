import { TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import React from "react";

interface GenericTableProps {
    className: string;
    head: any[];
    cells: any[];
    data: any[];
}

export const GenericTable: React.FC<GenericTableProps> = ({ className, head, cells, data }) => {
    return (
        <TableContainer className={className}>
            <Table>
                <TableHead>
                    <TableRow>
                        {head.map(({ name, ...rest }) => <TableCell {...rest}>{name}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(row => (
                        <TableRow hover>
                            {Object.keys(row).map((item, index) => (
                                <TableCell {...cells[index]}>{row[item]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}