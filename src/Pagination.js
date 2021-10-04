import React from "react";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useColumnOrder,
  usePagination,
} from "react-table";
import imgNull from "global/img/null.svg";
import { ImTable2 } from "react-icons/im";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FixedSizeList } from "react-window";
import classes from "./Table.module.css";
import { useSticky } from "react-table-sticky";
import {
  Button,
  Box,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Center,
  Spinner,
  Text,
  HStack,
  Select,
  IconButton,
  Icon,
  Spacer,
  Divider,
} from "@chakra-ui/react";

import {
  CgPushChevronLeft,
  CgPushChevronRight,
  CgChevronLeft,
  CgChevronRight,
} from "react-icons/cg";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, label, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <Checkbox
        colorScheme="teal"
        ref={resolvedRef}
        {...rest}
        isChecked={rest.checked}
      >
        {label}
      </Checkbox>
    );
  }
);

const Datatable = ({
  columns,
  data,
  renderFilter,
  isLoading,
  isFetching,
  isSearch,
  isSuccess,
  isError,
  pageCount: controlledPageCount,
  totalData,
  dataCount,
  onEventChange,
}) => {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: 150,
      maxWidth: 400,
    }),
    []
  );

  const tableInstance = useTable(
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
        pageSize: 5,
        pageIndex: 0,
      },
      manualPagination: true,
      manualGlobalFilter: true,
      autoResetPage: true,
      pageCount: controlledPageCount,
    },
    useBlockLayout,
    useResizeColumns,
    useColumnOrder,
    useSticky,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    allColumns,
    getToggleHideAllColumnsProps,
    state: { pageIndex, pageSize },
    totalColumnsWidth,
    prepareRow,
  } = tableInstance;

  const renderRow = React.useCallback(
    ({ index, style }) => {
      const row = page[index];
      if (!row) return <div>Loading...</div>;
      prepareRow(row);
      const { style: rowStyle, ...restRow } = row.getRowProps({ style });
      return (
        <div
          {...restRow}
          style={{ ...rowStyle, width: totalColumnsWidth }}
          className={classes.tr}
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className={classes.td}>
                {cell.isGrouped ? (
                  <>
                    <span {...row.getToggleRowExpandedProps()}>
                      {row.isExpanded ? "👇" : "👉"}
                    </span>{" "}
                    {cell.render("Cell")}
                  </>
                ) : cell.isAggregated ? null : cell.isPlaceholder ? null : (
                  cell.render("Cell")
                )}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, page, totalColumnsWidth]
  );

  React.useEffect(() => {
    onEventChange({ pageSize, pageIndex });
  }, [onEventChange, pageIndex, pageSize]);

  if (isError) {
    return "Error";
  }

  return (
    <>
      <div className={classes.wrapper}>
        <Stack direction="row" alignItems="flex-end" mb="16px" spacing="8px">
          <Box>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={Button}
                variant="primary"
                leftIcon={<ImTable2 />}
                rightIcon={<ChevronDownIcon />}
              >
                Filter Kolom Table
              </MenuButton>
              <MenuList minWidth="240px" px="15px" py="15px">
                <Box>
                  <Box>
                    <IndeterminateCheckbox
                      {...getToggleHideAllColumnsProps()}
                      label="Pilih Semua"
                    />
                  </Box>
                  {allColumns.map((column) => (
                    <div key={column.id}>
                      <label>
                        <Checkbox
                          colorScheme="teal"
                          {...column.getToggleHiddenProps()}
                          isChecked={column.getToggleHiddenProps().checked}
                        >
                          {column.Header}
                        </Checkbox>
                      </label>
                    </div>
                  ))}
                </Box>
              </MenuList>
            </Menu>
          </Box>
          <Box flex="1">{renderFilter}</Box>
        </Stack>

        <div
          {...getTableProps()}
          className={`${classes.table} ${classes.sticky}`}
        >
          <FixedSizeList
            height={341}
            itemCount={rows.length}
            itemSize={58}
            width="100%"
            innerElementType={({ children, style, ...rest }) => (
              <>
                <div className={classes.header}>
                  {headerGroups.map((headerGroup) => (
                    <div
                      {...headerGroup.getHeaderGroupProps()}
                      className={`${classes.tr}`}
                    >
                      {headerGroup.headers.map((column) => (
                        <div
                          {...column.getHeaderProps()}
                          className={classes.th}
                        >
                          {column.render("Header")}
                          {column.canResize ? (
                            <div
                              {...column.getResizerProps()}
                              className={classes.resizer}
                            ></div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className={classes.body}>
                  <div {...getTableBodyProps()} {...rest} style={style}>
                    {children}
                  </div>
                </div>
              </>
            )}
          >
            {renderRow}
          </FixedSizeList>
        </div>
        {isLoading && (
          <Box
            position="absolute"
            top="45px"
            left="10px"
            right="10px"
            bottom="10px"
          >
            <Center w="100%" h="100%" mt="-15px">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="teal"
                size="xl"
              />
            </Center>
          </Box>
        )}
        {data.length === 0 && isSuccess && (
          <Box
            position="absolute"
            top="50px"
            left="10px"
            right="10px"
            bottom="10px"
          >
            <Center w="100%" h="100%" mt="-15px">
              <Box>
                <img
                  src={imgNull}
                  alt="kosong"
                  style={{ margin: "0 auto 8px auto" }}
                />
                {isSearch ? "Pencarian Tidak Ditemukan" : "Data Kosong"}
              </Box>
            </Center>
          </Box>
        )}

        <div className={classes.pagination}>
          <Stack
            direction="row"
            spacing="12px"
            align="center"
            mt="10px"
            pb="10px"
          >
            <IconButton
              size="sm"
              variant="ghost"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              icon={
                <Icon as={CgPushChevronLeft} w="24px" h="24px" color="grey.2" />
              }
            />
            <IconButton
              size="sm"
              variant="ghost"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              icon={
                <Icon as={CgChevronLeft} w="24px" h="24px" color="grey.2" />
              }
            />
            <Text>
              Page {pageIndex + 1} Dari {pageOptions.length}{" "}
            </Text>
            {/* <Input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            /> */}
            <IconButton
              size="sm"
              variant="ghost"
              onClick={() => nextPage()}
              disabled={!canNextPage}
              icon={
                <Icon as={CgChevronRight} w="24px" h="24px" color="grey.2" />
              }
            />
            <IconButton
              size="sm"
              variant="ghost"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              icon={
                <Icon
                  as={CgPushChevronRight}
                  w="24px"
                  h="24px"
                  color="grey.2"
                />
              }
            />
            <Center height="30px">
              <Divider orientation="vertical" borderColor="grey.3" />
            </Center>
            <Text>Result per page</Text>
            <Box>
              <Select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 1, 20, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </Select>
            </Box>
            <Center height="30px">
              <Divider orientation="vertical" borderColor="grey.3" />
            </Center>
            <Box>
              Tampilkan {dataCount} dari {totalData}
            </Box>
            <Spacer />
            <Box>
              {isFetching && !isLoading && (
                <Box>
                  <HStack alignItems="center" justifyContent="flex-end">
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
            </Box>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default Datatable;
