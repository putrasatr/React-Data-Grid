import React, { useMemo, useState } from "react";
import DraggableTableColumn from "./DraggableColumn";

import { makeData } from "../helpers";

export default function App() {
    const rows = useMemo(() => makeData(5), [])
    const columns = useMemo(() => [
        {
            Header: "First Name",
            accessor: "firstName"
        },
        {
            Header: "Last Name",
            accessor: "lastName"
        },
        {
            Header: "Age",
            accessor: "age"
        },
        {
            Header: "Visits",
            accessor: "visits"
        },
        {
            Header: "Status",
            accessor: "status"
        },
        {
            Header: "Profile Progress",
            accessor: "progress"
        },
    ])
    const [data, setData] = useState({
        columns,
        rows
    })
    return <DraggableTableColumn
        columns={data.columns}
        data={data.rows}
        onDragEnd={(type, from, to, newData) => {
            setData(newData);
        }}
    />
}