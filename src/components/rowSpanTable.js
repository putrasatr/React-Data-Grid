import * as React from "react";
import { useTable, useResizeColumns, useSortBy } from "react-table";
import {
    Td, Th,
    Table, Tr,
    Tbody, Thead,
} from "@chakra-ui/react";

const borderStyle = {
    border: "1px solid gray",
    padding: "8px 10px",
    position: "relative"
};

function useInstance(instance) {
    const { allColumns } = instance;

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

    Object.assign(instance, { rowSpanHeaders });
}
function useDrop(instance) {
    const { allColumns } = instance;
    let dropper = []
    allColumns.forEach(item => {
        const { id, enableDrag } = item
        if (enableDrag) dropper = [
            ...dropper,
            {
                id, style: {
                    backgroundColor: "red"
                }
            }
        ]
    })

    Object.assign(instance, { dropper });
}

export default function App() {
    const origData = [
        {
            actor: "Johnny Depp",
            origin: "USA",
            movies: [
                {
                    name: "Pirates of the Carribean 1"
                },
                {
                    name: "Pirates of the Carribean 1"
                },
                {
                    name: "Pirates of the Carribean 1"
                },
                {
                    name: "Pirates of the Carribean 4"
                }
            ]
        },
        {
            actor: "Tobey Maguire",
            origin: "Indonesia",
            movies: [
                {
                    name: "Spider-Man 1"
                },
                {
                    name: "Spider-Man 2"
                },
                {
                    name: "Spider-Man 3"
                }
            ]
        },
        {
            actor: "Iko Uwais",
            origin: "USA",
            movies: [
                {
                    name: "The Raid 1"
                },
                {
                    name: "The Raid 2"
                }
            ]
        }
    ];
    const getData = () => {
        let newData = []
        origData.forEach(actorObj => {
            if (actorObj.movies.length)
                return actorObj.movies.forEach(movie => {
                    newData.push({
                        actor: actorObj.actor,
                        movie: movie.name,
                        origin: actorObj.origin
                    });
                });
            newData.push({
                actor: actorObj.actor,
                movie: "",
                origin: actorObj.origin
            });
        });
        return newData
    }
    const data = getData()
    const columns = React.useMemo(
        () => [
            {
                Header: "Actor",
                accessor: "actor",
                enableRowSpan: true,
                enableDrag: true
            },
            {
                Header: "Movies",
                accessor: "movie",
                enableRowSpan: true
            },
            {
                Header: "Origin",
                accessor: "origin",
                enableRowSpan: true
            }
        ],
        []
    );
    const defaultColumn = React.useMemo(
        () => ({
            minWidth: 50,
            width: 150,
            maxWidth: 300,
        }),
        []
    )
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        rowSpanHeaders,
        dropper
    } = useTable({
        columns,
        data,
        defaultColumn
    },
        useResizeColumns,
        useSortBy,
        hooks => {
            hooks.useInstance.push(useInstance);
            hooks.useInstance.push(useDrop);
        }
    );
    const dropStyle = dropper[0]
    return (
        <Table {...getTableProps()} variant="striped" colorScheme="gray">
            <Thead>
                {headerGroups.map(headerGroup => (
                    <Tr  {...headerGroup.getHeaderGroupProps()} {...dropStyle}>
                        {headerGroup.headers.map(column => (
                            <Th {...column.getHeaderProps(column.getSortByToggleProps())} style={borderStyle}>
                                {column.render("Header")}
                                <div {...column.getResizerProps()}
                                    className="resize" />
                            </Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    for (let j = 0; j < row.allCells.length; j++) {
                        let cell = row.allCells[j];
                        let rowSpanHeader = rowSpanHeaders.find(
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
                    return null;
                })}
                {rows.map(row => {
                    return (
                        <Tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                if (cell.isRowSpanned) return null;
                                else
                                    return (
                                        <Td
                                            style={borderStyle}
                                            rowSpan={cell.rowSpan}
                                            {...cell.getCellProps()}
                                        >
                                            {cell.render("Cell")}
                                        </Td>
                                    );
                            })}
                        </Tr>
                    );
                })}
            </Tbody>
        </Table>
    );
}