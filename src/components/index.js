import React from "react";
import { VStack, Image, Box, Flex } from "@chakra-ui/react";
import { } from "react-redux";

import ItemList from "./itemList";
import RowSpanTable from "./rowSpanTable";
import NFLWP from "../assets/images/nfl.jpg";
import TableDnd from "./TableDnd";
import TableDndColumn from './TableDndColumn';
import "./styles.css";

export default function MyApp() {
    // const [width,height] = useWindowSize()
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
        </VStack>
    )
}