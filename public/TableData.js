import React, { useRef, useState } from "react";
import { useTable, useResizeColumns, useSortBy } from "react-table";
import { useSticky } from "react-table-sticky";
import { FiChevronDown } from "react-icons/fi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import {
    Td, Th,
    Table, Tr,
    Tbody, Thead,
    Box, Icon, HStack,
    Image, Spacer,
    Text, Menu,
    MenuList, MenuItem,
    Portal, MenuButton
} from "@chakra-ui/react";

import TableIcon from "assets/icons/table.png";
import GoogleSheetIcon from "assets/icons/google-sheets.png";
import { Button } from "components";
import { IndeterminateCheckbox } from "utils";
import { DRAG_DIRECTION_COLUMN, defaultDrageState } from "constants/index"
import { offsetIndex, getNumberFormatThousand } from "helpers";


const borderStyle = {
    border: "1px solid gray",
    padding: "8px 10px",
    position: "relative"
};

function useInstance(instance) {
    const { allColumns, rows, prepareRow } = instance;

    let rowSpanHeaders = [];

    allColumns.forEach((column, i) => {
        const { id, enableRowSpan } = column;

        if (enableRowSpan !== undefined) {
            rowSpanHeaders = [
                ...rowSpanHeaders,
                { id, topCellValue: null, topCellIndex: 0 }
            ];
        }
    });
    let rowSpanHeader = []
    if (rows.length)
        rows.forEach((row, i) => {
            prepareRow(row);
            for (let j = 0; j < row.allCells.length; j++) {
                let cell = row.allCells[j];
                rowSpanHeader = rowSpanHeaders.find(
                    x => x.id === cell.column.id
                );
                if (rowSpanHeader !== undefined) {
                    if (
                        rowSpanHeader.topCellValue === null ||
                        rowSpanHeader.topCellValue !== cell.value
                    ) {
                        cell.isRowSpanned = false;
                        rowSpanHeader.topCellValue = cell.value;
                        rowSpanHeader.topCellIndex = i;
                        cell.rowSpan = 1;
                    } else {
                        rows[rowSpanHeader.topCellIndex].allCells[j].rowSpan++;
                        cell.isRowSpanned = true;
                    }
                }
            }
        })
    Object.assign(instance, { rowSpanHeaders, rowSpanHeader });
}

export default function TableData({
    onDragEnd,
    columns,
    data
}) {

    const defaultColumn = React.useMemo(
        () => ({
            minWidth: 50,
            width: 150,
            maxWidth: 300,
        }),
        []
    )

    let {
        headerGroups,
        rows,
        allColumns,
        getTableProps,
        getTableBodyProps,
        getToggleHideAllColumnsProps
    } = useTable({
        columns,
        data,
        defaultColumn,
    },
        useResizeColumns,
        useSticky,
        useSortBy,
        hooks => { hooks.useInstance.push(useInstance); }
    );
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
        : 1;
    return (
        <>
            <HStack w="100%" py="14px">
                <Menu isLazy closeOnSelect={false}>
                    <MenuButton>
                        <HStack
                            h="38px"
                            justifyContent="center"
                            alignItems="center"
                            borderRadius="4px"
                            px="16px"
                            w="220px"
                            bg="brand.main">
                            <Image src={TableIcon} />
                            <Text fontSize="14px" color="white" fontWeight="600">Filter Kolom Tabel</Text>
                            <Icon as={FiChevronDown} color="white" fontSize="20px" fontWeight="900" />
                        </HStack>
                    </MenuButton>
                    <Portal>
                        <MenuList zIndex="997" height="250px" overflow="scroll">
                            <MenuItem height="40px">
                                <label className="menu__container">
                                    <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />  Semua
                                    <Text className="checkmark"></Text>
                                </label>
                            </MenuItem>
                            {allColumns.map(column => (
                                <MenuItem key={column.id} height="40px">
                                    <label className="menu__container">
                                        <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
                                        {column.Header}
                                        <Text className="checkmark"></Text>
                                    </label>
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Portal>
                </Menu>
                <Box
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="4px"
                    p="0"
                    bg="brand.main">
                    <Button
                        justifyContent="space-between"
                        p="8px 16px"
                        h="38px"
                        w="100%">
                        <Image src={GoogleSheetIcon} />
                        <Spacer w="12px" />
                        <Text fontSize="14px" color="white">Export Excel</Text>
                    </Button>
                </Box>
            </HStack>
            <Box
                overflow="auto"
                overflowY="scroll"
                border="1px solid #E0E0E0"
                borderRadius="10px"
                w="100%"
                position="relative">
                <Table
                    {...getTableProps()}
                    className="table">
                    <Thead>
                        {headerGroups.map((headerGroup, i) => (
                            <Tr ref={headsEl}  {...headerGroup.getHeaderGroupProps()} className="tr">
                                {headerGroup.headers.map((column, j) => (
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
                                        <div {...column.getResizerProps()}
                                            className="resize" />
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody {...getTableBodyProps()} className="tbody">
                        {rows.map(row => {
                            return (
                                <Tr {...row.getRowProps()} ref={rowsEl} className="tr">
                                    {row.cells.map((cell, j) => {
                                        if (cell.isRowSpanned) return null;
                                        else
                                            return (
                                                <Td
                                                    style={borderStyle}
                                                    opacity={setOpacity(j)}
                                                    rowSpan={cell.rowSpan}
                                                    {...cell.getCellProps()}
                                                    className="td td__rowspan"
                                                    border="1px solid #E0E0E0;"
                                                >
                                                    {isNaN(cell.value) ? cell.render("Cell") : getNumberFormatThousand(cell.value)}
                                                </Td>
                                            );
                                    })}
                                </Tr>
                            );
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
        </>
    );
}