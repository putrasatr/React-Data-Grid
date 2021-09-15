import React, { useState, useRef } from 'react';
import { useTable } from 'react-table';
import { offsetIndexReactTable } from '../helpers';

const DRAG_DIRECTION_COLUMN = "column";

const defaultDrageState = {
    column: -1,
    row: -1,
    startPoint: null,
    direction: "", // row=move up down/column=move left right,
    dropIndex: -1 // drag target
};


export default function DraggableColumn({ columns = [], data = [], onDragEnd }) {
    let {
        getTableBodyProps,
        getTableProps,
        headerGroups,
        prepareRow,
        rows
    } = useTable({
        columns,
        data
    })
    let [dragState, setDragState] = useState({ ...defaultDrageState });
    const headsEl = useRef(null),
        rowsEl = useRef(null),
        preview = useRef(null);
    if (dragState.direction === DRAG_DIRECTION_COLUMN) {
        headerGroups = offsetIndexReactTable(dragState.column, dragState.dropIndex, headerGroups);
        // rows = rows.map(x => offsetIndexReactTableRow(dragState.column, dragState.dropIndex, x))
    }

    return (
        <div>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup, i) => (
                        <tr ref={headsEl}  {...headerGroup.getHeaderGroupProps()} className="tr">
                            {headerGroup.headers.map((column, j) => (
                                <th
                                    {...column.getHeaderProps()}
                                    className="th"
                                    style={{
                                        border: "1px solid black",
                                        cursor: "move",
                                        opacity:
                                            dragState.direction === DRAG_DIRECTION_COLUMN
                                                ? dragState.dropIndex === j
                                                    ? 0.5
                                                    : 1
                                                : 1
                                    }}
                                    draggable="true"
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
                                    }}
                                    onDragEnd={() => {
                                        onDragEnd(
                                            dragState.direction,
                                            dragState.column,
                                            dragState.dropIndex,
                                            { columns: headerGroups[0].headers, rows: data }
                                        );
                                        setDragState({ ...defaultDrageState });
                                    }}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody  {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className="tr">
                                {row.cells.map((cell, j) => {
                                    return (
                                        <td ref={rowsEl}
                                            {...cell.getCellProps()}
                                            className="td"
                                            style={{
                                                opacity:
                                                    dragState.direction === DRAG_DIRECTION_COLUMN
                                                        ? dragState.dropIndex === j
                                                            ? 0.5
                                                            : 1
                                                        : 1
                                            }}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <th>

                        </th>
                    </tr>
                </tfoot>
            </table>
            <div
                ref={preview}
                style={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    overflow: "hidden"
                }}
            />
        </div >
    )
}