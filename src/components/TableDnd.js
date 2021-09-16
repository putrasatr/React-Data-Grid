import React, { useState} from "react";
import ReactTableDragColumnRow from "./dragableTable";

import "./styles.css";

function App() {
    let [data, setData] = useState({
        heads: ["a", "b", "c", "d", "e", "f"],
        rows: [
            [1, 2, 3, 1, 2, 3],
            [11, 2, 3, 11, 2, 3],
            [1, 22, 3, 1, 22, 3],
            [1, 2, 33, 1, 2, 33]
        ]
    });
    return (
        <div>
            <span>react table drag column row</span>
            <ReactTableDragColumnRow
                heads={data.heads}
                rows={data.rows}
                onDragEnd={(type, from, to, newData) => {
                    console.log({
                        type,
                        from,
                        to,
                        newData
                    });
                    setData(newData);
                }}
            />
        </div>
    );
}

export default App
