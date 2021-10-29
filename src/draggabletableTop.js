import React, { useRef, useState } from "react";
import {
  useTable,
  useResizeColumns,
  useColumnOrder,
  useSortBy,
} from "react-table";
import { useSticky } from "react-table-sticky";
import { FiChevronDown } from "react-icons/fi";
// import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import {
  Td,
  Th,
  Table,
  Tr,
  Tbody,
  Thead,
  Tfoot,
  Box,
  Icon,
  HStack,
  Text,
  Menu,
  MenuList,
  MenuItem,
  Portal,
  MenuButton,
  Spinner,
} from "@chakra-ui/react";
import { IndeterminateCheckbox } from "utils";
import { DRAG_DIRECTION_COLUMN, defaultDrageState } from "utils";
import { offsetIndex } from "utils/helper";
import { useRowSpan } from "hooks";
import "./style.css";
import { TableIcon } from "global/icons";

function TableData({
  onDragEnd,
  columns,
  data,
  withFooter = true,
  staticRow = () => {},
  operator_name = "",
  isFetching,
  renderExportExcel,
}) {
  // console.log(data)
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: 150,
      maxWidth: 300,
    }),
    []
  );

  let {
    headerGroups,
    rows,
    allColumns,
    getTableProps,
    getTableBodyProps,
    getToggleHideAllColumnsProps,
    prepareRow,
    rowSpanHeaders,
    footerGroups,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        columnOrder: [],
        hiddenColumns: columns.map((column) => {
          if (column.show === false) return column.accessor || column.id;
          else return null;
        }),
      },
    },
    useResizeColumns,
    useSticky,
    useColumnOrder,
    useSortBy,
    (hooks) => {
      hooks.useInstance.push(useRowSpan);
    }
  );
  let [dragState, setDragState] = useState({ ...defaultDrageState });
  const headsEl = useRef(null),
    rowsEl = useRef(null),
    preview = useRef(null);
  if (dragState.direction === DRAG_DIRECTION_COLUMN) {
    headerGroups = offsetIndex(
      dragState.column,
      dragState.dropIndex,
      headerGroups
    );
  }
  const setOpacity = (j) =>
    dragState.direction === DRAG_DIRECTION_COLUMN
      ? dragState.dropIndex === j
        ? 0.5
        : 1
      : 1;
  return (
    <>
      <HStack w="100%" py="14px">
        <Menu isLazy closeOnSelect={false}>
          <MenuButton borderRadius="4px">
            <HStack
              h="38px"
              justifyContent="center"
              alignItems="center"
              borderRadius="4px"
              px="16px"
              w="220px"
              bg="primary.main"
              color="white"
            >
              <Icon as={TableIcon} />
              <Text fontSize="14px" fontWeight="600">
                Filter Kolom Tabel
              </Text>
              <Icon
                as={FiChevronDown}
                color="white"
                fontSize="20px"
                fontWeight="900"
              />
            </HStack>
          </MenuButton>
          <Portal>
            <MenuList zIndex="997" height="250px" overflow="scroll">
              <MenuItem height="40px">
                <label className="menu__container">
                  <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />{" "}
                  Semua
                  <Text className="checkmark"></Text>
                </label>
              </MenuItem>
              {allColumns.map((column) => (
                <MenuItem key={column.id} height="40px">
                  <label className="menu__container">
                    <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
                    {column.Header}
                    <Text className="checkmark"></Text>
                  </label>
                </MenuItem>
              ))}
            </MenuList>
          </Portal>
        </Menu>
        {renderExportExcel}
        {isFetching && (
          <Box>
            <HStack alignItems="center">
              <Box>
                <Text fontWeight="500" color="primary.main">
                  Loading...
                </Text>
              </Box>
              <Box pt="5px">
                <Spinner size="sm" color="primary.main" />
              </Box>
            </HStack>
          </Box>
        )}
      </HStack>
      <Box
        overflow="scroll"
        overflowY="scroll"
        border="1px solid #E0E0E0"
        borderRadius="10px"
        w="100%"
        h={data.length ? "400px" : ""}
        position="relative"
      >
        <Table {...getTableProps()} className="table sticky">
          <Thead className="header">
            {headerGroups.map((headerGroup, i) => (
              <Tr
                ref={headsEl}
                {...headerGroup.getHeaderGroupProps()}
                className="tr"
              >
                {headerGroup.headers.map((column, j) => (
                  <Th
                    textTransform="none"
                    fontSize="16px !important"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    cursor={column.disableDrag ? "pointer" : "move !important"}
                    opacity={setOpacity(j)}
                    className="th"
                    draggable={!column.disableDrag}
                    onDragStart={(e) => {
                      e.dataTransfer.setDragImage(preview.current, 0, 0);
                      setDragState({
                        ...dragState,
                        row: i,
                        column: j,
                        startPoint: {
                          x: e.pageX,
                          y: e.pageY,
                        },
                      });
                    }}
                    onDragEnter={(e) => {
                      if (!column.disableDrag) {
                        if (!dragState.direction) {
                          if (dragState.column !== j) {
                            setDragState({
                              ...dragState,
                              direction: DRAG_DIRECTION_COLUMN,
                              dropIndex: j,
                            });
                            return;
                          }
                          return;
                        }

                        if (dragState.direction === DRAG_DIRECTION_COLUMN) {
                          if (j !== dragState.dropIndex) {
                            setDragState({
                              ...dragState,
                              dropIndex: j,
                            });
                          }
                          return;
                        }
                      }
                    }}
                    onDragEnd={() => {
                      onDragEnd({
                        columns: headerGroups[0].headers,
                        rows: data,
                      });
                      setDragState({ ...defaultDrageState });
                    }}
                  >
                    {column.render("Header")}
                    <div {...column.getResizerProps()} className="resize" />
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} className="tbody">
            {rows.forEach((row, i) => {
              prepareRow(row);
              for (let j = 0; j < row.allCells.length; j++) {
                let rowSpanHeader;
                let cell = row.allCells[j];
                rowSpanHeader = rowSpanHeaders.find(
                  (x) => x.id === cell.column.id
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
            })}
            {rows.map((row, i) => {
              if (!rowSpanHeaders.length) prepareRow(row);
              if (row.original.headingGroup)
                return staticRow(columns.length, row.original.headingGroup);
              return row.original.isEmpty ? (
                <Tr key={i}>
                  <Td>
                    <Text
                      className="txt__base__reg txt__grey1"
                      padding="16px 20px"
                    >
                      Data Kosong
                    </Text>
                  </Td>
                </Tr>
              ) : (
                <Tr {...row.getRowProps()} ref={rowsEl} className="tr">
                  {row.cells.map((cell, j) => {
                    if (cell.isRowSpanned) return null;
                    else
                      return (
                        <Td
                          opacity={setOpacity(j)}
                          rowSpan={cell.rowSpan}
                          {...cell.getCellProps()}
                          className={
                            rowSpanHeaders.length ? "td td__rowspan" : "td"
                          }
                        >
                          {cell.render("Cell")}
                        </Td>
                      );
                  })}
                </Tr>
              );
            })}
          </Tbody>
          {!data.length ? (
            <Tfoot className="footer">
              <Tr>
                <Td>
                  <Text
                    className="txt__base__reg txt__grey1"
                    padding="16px 20px"
                  >
                    Data Kosong
                  </Text>
                </Td>
              </Tr>
            </Tfoot>
          ) : (
            withFooter && (
              <Tfoot className="footer">
                {footerGroups.map((footerGroup) => (
                  <Tr
                    {...footerGroup.getHeaderGroupProps()}
                    className="tr__footer"
                  >
                    {footerGroup.headers.map((column) => (
                      <Th
                        textTransform="none"
                        {...column.getHeaderProps()}
                        className="th"
                        fontSize="16px !important"
                      >
                        {column.render("Footer")}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Tfoot>
            )
          )}
        </Table>
        <div
          ref={preview}
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            overflow: "hidden",
          }}
        />
      </Box>
    </>
  );
}

export default React.memo(TableData);
