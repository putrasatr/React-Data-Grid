import React, { useState, useRef } from "react";
import { offsetIndex } from "../helpers"

// tell direction after drag start, the first dirction that reach 5px offset
const DRAG_DIRECTION_NONE = "";
const DRAG_DIRECTION_ROW = "row";
const DRAG_DIRECTION_COLUMN = "column";

const defaultDrageState = {
  column: -1,
  row: -1,
  startPoint: null,
  direction: DRAG_DIRECTION_NONE, // row=move up down/column=move left right,
  dropIndex: -1 // drag target
};
const DraggableTable = props => {
  let { heads = [], rows = [], onDragEnd } = props;
  let [dragState, setDragState] = useState(defaultDrageState);
  const headsEl = useRef(null),
    rowsEl = useRef(null),
    preview = useRef(null);

  if (dragState.direction === DRAG_DIRECTION_COLUMN) {
    heads = offsetIndex(dragState.column, dragState.dropIndex, heads);
    rows = rows.map(x => offsetIndex(dragState.column, dragState.dropIndex, x));
  }

  if (dragState.direction === DRAG_DIRECTION_ROW) {
    rows = offsetIndex(dragState.row, dragState.dropIndex, rows);
  }
  return (
    <div>
      <table>
        <thead >
          <tr ref={headsEl}>
            {heads.map((x, i) => (
              <th key={i}>{x}</th>
            ))}
          </tr>
        </thead>
        <tbody >
          {rows.map((x = [], i) => (
            <tr ref={rowsEl} key={i}>
              {x.map((y, j) => (
                <td
                  key={j}
                  style={{
                    border: "1px solid black",
                    cursor: dragState.direction ? "move" : "grab",
                    opacity:
                      dragState.direction === DRAG_DIRECTION_COLUMN
                        ? dragState.dropIndex === j
                          ? 0.5
                          : 1
                        : dragState.direction === DRAG_DIRECTION_ROW
                          ? dragState.dropIndex === i
                            ? 0.5
                            : 1
                          : 1
                  }}
                  draggable="true"
                  onDragStart={e => {
                    e.dataTransfer.setDragImage(preview.current, 0, 0);
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
                      if (dragState.row !== i) {
                        setDragState({
                          ...dragState,
                          direction: DRAG_DIRECTION_ROW,
                          dropIndex: i
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
                    if (dragState.direction === DRAG_DIRECTION_ROW) {
                      if (i !== dragState.dropIndex) {
                        setDragState({
                          ...dragState,
                          dropIndex: i
                        });
                      }
                      return;
                    }
                  }}
                  onDragEnd={() => {
                    onDragEnd(
                      dragState.direction,
                      dragState.direction === DRAG_DIRECTION_COLUMN
                        ? dragState.column
                        : dragState.row,
                      dragState.dropIndex,
                      { heads, rows }
                    );
                    setDragState({ ...defaultDrageState });
                  }}
                >
                  {y}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
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
    </div>
  );
};

export default DraggableTable