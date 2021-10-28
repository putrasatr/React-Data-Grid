import React, { useState, useRef } from "react";
import {
    Table, Box,
    Thead, Tr,
    Th, Tbody,
    Td,     Icon
} from "@chakra-ui/react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import { DRAG_DIRECTION_COLUMN, defaultDrageState } from "constants/index"
import { offsetIndex } from "utils/helper";


export default function TableData({ getTableBodyProps, getTableProps, headerGroups, footerGroups, rows, prepareRow, data, onDragEnd }) {
    let [dragState, setDragState] = useState({ ...defaultDrageState });
    const headsEl = useRef(null),
        rowsEl = useRef(null),
        preview = useRef(null);
    if (dragState.direction === DRAG_DIRECTION_COLUMN) {
        headerGroups = offsetIndex(dragState.column, dragState.dropIndex, headerGroups);
    }
    const setOpacity = j => dragState.direction === DRAG_DIRECTION_COLUMN
        ? dragState.dropIndex === j
            ? 0.5
            : 1
        : 1
    return (
        <Box overflow="auto" border="1px solid #E0E0E0" borderRadius="10px" w="100%" display="flex">
            <Table {...getTableProps()} w="80%" h="400px" variant="striped" colorScheme="gray" className="table sticky">
                <Thead className="header">
                    {headerGroups.map((headerGroup, i) => (
                        <Tr ref={headsEl} {...headerGroup.getHeaderGroupProps()} key={i} className="tr">
                            {headerGroup.headers.map((column, j) => {
                                return (
                                    <Th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        cursor={column.disableDrag ? "pointer" : "move !important"}
                                        opacity={setOpacity(j)}
                                        className="th"
                                        draggable={!column.disableDrag}
                                        onDragStart={e => {
                                            e.dataTransfer.setDragImage(preview.current, 0, 0)
                                            setDragState({
                                                ...dragState,
                                                row: i,
                                                column: j,
                                                startPoint: {
                                                    x: e.pageX,
                                                    y: e.pageY
                                                }
                                            });
                                        }}
                                        onDragEnter={e => {
                                            if (!column.disableDrag) {
                                                if (!dragState.direction) {
                                                    if (dragState.column !== j) {
                                                        setDragState({
                                                            ...dragState,
                                                            direction: DRAG_DIRECTION_COLUMN,
                                                            dropIndex: j
                                                        });
                                                        return;
                                                    }
                                                    return;
                                                }

                                                if (dragState.direction === DRAG_DIRECTION_COLUMN) {
                                                    if (j !== dragState.dropIndex) {
                                                        setDragState({
                                                            ...dragState,
                                                            dropIndex: j
                                                        });
                                                    }
                                                    return;
                                                }
                                            }
                                        }}
                                        onDragEnd={() => {
                                            onDragEnd(
                                                dragState.direction,
                                                dragState.column,
                                                dragState.dropIndex,
                                                { columns: headerGroups[0].headers, rows: data }
                                            );
                                            setDragState({ ...defaultDrageState });
                                        }}
                                    >
                                        {column.render("Header")}
                                        {column.isSorted ? < Icon fontSize="16px" as={column.isSortedDesc
                                            ? IoMdArrowDropdown
                                            : IoMdArrowDropup
                                        } />
                                            : ''}
                                        <div
                                            {...column.getResizerProps()}
                                            className="resizer"
                                        />
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()} className="body">
                    <Tr className="tr" >
                        <Th bg="#DFF2F1" colSpan={rows.length} className="th operator__name">Nama Operator: Pulsa AXIS</Th>
                    </Tr>   
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <Tr
                                ref={rowsEl} bg="white" {...row.getRowProps()} key={i} className="tr">
                                {row.cells.map((cell, j) => {
                                    return <Td opacity={setOpacity(j)} {...cell.getCellProps()} className="td">{cell.render('Cell')}</Td>
                                })}
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
            <div
                ref={preview}
                style={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    overflow: "hidden"
                }}
            />
        </Box>
    )
}