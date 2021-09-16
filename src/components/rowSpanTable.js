import * as React from "react";
import { useTable, useResizeColumns } from "react-table";

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

export default function App() {
    const origData = [
        {
            actor: "Johnny Depp",
            movies: [
                {
                    name: "Pirates of the Carribean 1"
                },
                {
                    name: "Pirates of the Carribean 2"
                }
            ]
        },
        {
            actor: "Daniel Craig",
            movies: []
        },
        {
            actor: "Reza Rahardian",
            movies: [
                { name: "My Stupid Boss" }
            ]
        }
    ];
    const getData = React.useCallback(() => {
        let newData = []
        origData.forEach(actorObj => {
            if (actorObj.movies.length)
                return actorObj.movies.forEach(movie => {
                    newData.push({
                        actor: actorObj.actor,
                        movie: movie.name
                    });
                });
            newData.push({
                actor: actorObj.actor,
                movie: ""
            });
        });
        return newData
    },[])
    const data = React.useMemo(() => getData(), [getData]);
    const columns = React.useMemo(
        () => [
            {
                Header: "Actor",
                accessor: "actor",
                enableRowSpan: true
            },
            {
                Header: "Movies",
                accessor: "movie"
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
        rowSpanHeaders
    } = useTable({
        columns,
        data,
        defaultColumn
    },
        useResizeColumns,
        hooks => {
            hooks.useInstance.push(useInstance);
        }
    );
    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} style={borderStyle}>
                                {column.render("Header")}
                                <div {...column.getResizerProps()}
                                    className="resize" />
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
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
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                if (cell.isRowSpanned) return null;
                                else
                                    return (
                                        <td
                                            style={borderStyle}
                                            rowSpan={cell.rowSpan}
                                            {...cell.getCellProps()}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}