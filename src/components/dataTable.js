import React, { useRef, useState } from "react";
import DataTable from "../Pagination";
import useColumn from "../useColumn";
import ButtonIcon from "./ButtonIcon";
import { Box, Stack, Spacer, Input } from "@chakra-ui/react";

export default function Components() {
  const [add, setShowAdd] = useState(false);
  const isLoading = false,
    isError = false,
    isFetching = false,
    isSuccess = false,
    data = {
      products: [
        {
          code: "AX5",
          fee: "2000",
          price: 12000,
          min_margin: 1,
          max_margin: 1,
          is_active: true,
          a: add,
        },
        {
          code: "AX5",
          fee: "2000",
          price: 12000,
          min_margin: 1,
          max_margin: 1,
          is_active: false,
        },
      ],
      pagination: {
        total_page: 1,
        data_count: 2,
      },
      total_data: 2,
    },
    columns = useColumn(),
    handleSetFilter = () => {},
    searchInput = useRef(null),
    onEventChange = () => {};
  return (
    <DataTable
      columns={columns}
      data={data ? data.products : []}
      isLoading={isLoading}
      isFetching={isFetching}
      isSearch={false}
      isSuccess={isSuccess}
      isError={isError}
      onEventChange={onEventChange}
      pageCount={data ? data.pagination.total_page : 0}
      totalData={data ? data.total_data : 0}
      dataCount={data ? data.pagination.data_count : 0}
      renderFilter={
        <Stack direction="row">
          <Box>
            <ButtonIcon
              leftIcon="add"
              text="Tambah Produk"
              variant="primary"
              onClick={() => setShowAdd(true)}
            />
          </Box>
          <Spacer />
          <Box>
            <form onSubmit={handleSetFilter}>
              <Stack direction="row" spacing="8px">
                <Input
                  size="md"
                  type="text"
                  w="255px"
                  placeholder="Search.."
                  ref={searchInput}
                />
                <ButtonIcon
                  type="submit"
                  variant="primary"
                  text="Set Filter"
                  leftIcon="setfilter"
                />
              </Stack>
            </form>
          </Box>
        </Stack>
      }
    />
  );
}
