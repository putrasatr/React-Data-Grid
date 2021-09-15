import { useLayoutEffect, useState } from "react";
import namor from 'namor'
import { MenuItem } from "@chakra-ui/menu";

export function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

const range = len => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

const newData = () => {
    return {
        firstName: namor.generate({ words: 1, numbers: 0 }),
        lastName: namor.generate({ words: 1, numbers: 0 }),
        age: Math.floor(Math.random() * 30),
        visits: Math.floor(Math.random() * 100),
        status: Math.random() > 0.4 ? "Relationship" : Math.random() > 0.65 ? "Not Relationship" : "Complicated",
        progress: Math.floor(Math.random() * 100)
    }
}

export const makeData = (...lens) => {
    const makeDataLevel = (depth = 0) => {
        const len = lens[depth]
        return range(len).map(d => {
            return {
                ...newData(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            }
        })
    }

    return makeDataLevel()
}

export function offsetIndex(from, to, arr = []) {
    if (from < to) {
        let start = arr.slice(0, from),
            between = arr.slice(from + 1, to + 1),
            end = arr.slice(to + 1);
        return [...start, ...between, arr[from], ...end];
    }
    if (from > to) {
        let start = arr.slice(0, to),
            between = arr.slice(to, from),
            end = arr.slice(from + 1);
        return [...start, arr[from], ...between, ...end];
    }
    return arr;
}
export function offsetIndexReactTable(from, to, arr = []) {
    return arr.map(item => {
        if (from < to) {
            let start = item.headers.slice(0, from),
                between = item.headers.slice(from + 1, to + 1),
                end = item.headers.slice(to + 1);
            return {
                ...item,
                headers: [...start, ...between, item.headers[from], ...end]
            }
        }
        if (from > to) {
            let start = item.headers.slice(0, to),
                between = item.headers.slice(to, from),
                end = item.headers.slice(from + 1);
            // item.headers = [...start, item.headers[from], ...between, ...end]
            return {
                ...item,
                headers: [...start, item.headers[from], ...between, ...end]
            }
        }
        return item
    })
}
export function offsetIndexReactTableRow(from, to, obj = {}) {
    if (from < to) {
        let start = obj.cells.slice(0, from),
            between = obj.cells.slice(from + 1, to + 1),
            end = obj.cells.slice(to + 1);
        return {
            ...obj,
            cells: [...start, ...between, obj.cells[from], ...end]
        }
    }
    if (from > to) {
        let start = obj.cells.slice(0, to),
            between = obj.cells.slice(to, from),
            end = obj.cells.slice(from + 1);
        // obj.cells = [...start, obj.cells[from], ...between, ...end]
        return {
            ...obj,
            cells: [...start, obj.cells[from], ...between, ...end]
        }
    }
    return obj
}