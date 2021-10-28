import React from "react";
import { Image, Box, Link, Text } from "@chakra-ui/react";

// import ItemList from "./itemList";
// import RowSpanTable from "./rowSpanTable";
// import NFLWP from "../assets/images/nfl.jpg";
// import TableDnd from "./TableDnd";
// import TableDndColumn from "./TableDndColumn";
// import Counter from "./counter";
// import EvergreenUI from "./Evergreen/evergreenUI";
// import TableSuit from "./Tablesuit";
import "./styles.css";

// export default function MyApp() {
//   return (
//     <VStack width="100%">
//       <span>React Table Example</span>
//       <Image src={NFLWP} height="40%" />
//       <VStack w="100%">
//         <Flex>
//           <Box w="100%" bg="gray">
//             <ItemList />
//           </Box>
//         </Flex>
//       </VStack>
//       <Image src={NFLWP} height="40%" />
//       <RowSpanTable />
//       <TableDnd />
//       <span>Table drag and drop</span>
//       <TableDndColumn />
//       <span>Table With Pagination</span>
//       <Counter />
//       <EvergreenUI />
//       <TableSuit />
//     </VStack>
//   );
// }

export default function App() {
  return (
    <Box p={4} display={{ md: "flex" }}>
      <Box flexShrink={0}>
        <Image
          borderRadius="lg"
          width={{ md: 40 }}
          src="https://bit.ly/2jYM25F"
          alt="Woman paying for a purchase"
        />
      </Box>
      <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
        <Text
          fontWeight="bold"
          textTransform="uppercase"
          fontSize="sm"
          letterSpacing="wide"
          color="teal.600"
        >
          Marketing
        </Text>
        <Link
          mt={1}
          display="block"
          fontSize="lg"
          lineHeight="normal"
          fontWeight="semibold"
          href="#"
        >
          Finding customers for your new business
        </Link>
        <Text mt={2} color="gray.500">
          Getting a new business off the ground is a lot of hard work. Here are
          five ideas you can use to find your first customers.
        </Text>
      </Box>
    </Box>
  );
}
