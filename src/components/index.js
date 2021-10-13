import React, { useRef, useState } from "react";
import { VStack, Image, Box, Flex, Stack, Spacer, Input } from "@chakra-ui/react";

import ItemList from "./itemList";
import RowSpanTable from "./rowSpanTable";
import NFLWP from "../assets/images/nfl.jpg";
import useColumn from "../useColumn"
import TableDnd from "./TableDnd";
import TableDndColumn from './TableDndColumn';
import ButtonIcon from "./ButtonIcon";
import Counter from "./counter"
import DataTable from "../Pagination";
import EvergreenUI from "./Evergreen/evergreenUI";
import "./styles.css";

export default function MyApp() {
    const [add, setShowAdd] = useState(false)

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
                    a: add
                },
                {
                    code: "AX5",
                    fee: "2000",
                    price: 12000,
                    min_margin: 1,
                    max_margin: 1,
                    is_active: false
                }
            ],
            pagination: {
                total_page: 1,
                data_count: 2
            },
            total_data: 2
        },
        columns = useColumn(),
        handleSetFilter = () => {

        },
        searchInput = useRef(null),
        onEventChange = () => { }
    return (
        <VStack width="100%">
            <span>React Table Example</span>
            <Image src={NFLWP} height="40%" />
            <VStack w="100%">
                <Flex>
                    <Box w="100%" bg="gray">
                        <ItemList />
                    </Box>
                </Flex>
            </VStack>
            <Image src={NFLWP} height="40%" />
            <RowSpanTable />
            <TableDnd />
            <span>Table drag and drop</span>
            <TableDndColumn />
            <span>Table With Pagination</span>
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
            <Counter />
            <EvergreenUI />
        </VStack>
    )
}