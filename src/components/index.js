import React from "react";
import { VStack, Image, Box, Flex } from "@chakra-ui/react";

import ItemList from "./itemList";
import RowSpanTable from "./rowSpanTable";
import NFLWP from "../assets/images/nfl.jpg";
import TableDnd from "./TableDnd";
import TableDndColumn from "./TableDndColumn";
import Counter from "./counter";
import EvergreenUI from "./Evergreen/evergreenUI";
import TableSuit from "./Tablesuit";
import "./styles.css";

export default function MyApp() {
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
      <Counter />
      <EvergreenUI />
      <TableSuit />
    </VStack>
  );
}
