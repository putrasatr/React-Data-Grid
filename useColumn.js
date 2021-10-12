import { useMemo } from "react";
import { Box, HStack } from "@chakra-ui/react";
import ButtonIcon from "components/ButtonIcon";
import { Active, NotActive } from "components/Status";

const useColumn = (setSelectedData, onOpenDelete, setShowEdit) => {
  const columns = useMemo(
    () => [
      {
        Header: "Kode Produk",
        accessor: "code",
      },
      {
        Header: "Fee",
        accessor: "fee",
      },
      {
        Header: "Harga Jual",
        accessor: "price",
      },
      {
        Header: "Min Selisih",
        accessor: "min_margin",
      },
      {
        Header: "Max Selisih",
        accessor: "max_margin",
      },
      {
        Header: "Status",
        accessor: "is_active",
        Cell: (props) => (
          <Box mt="-7.2px">{props.value ? <Active /> : <NotActive />}</Box>
        ),
      },
      {
        Header: "Aksi",
        sticky: "right",
        disableResizing: true,
        width: 220,
        Cell: (props) => {
          return (
            <HStack mt="-3px" spacing="10px" align="stretch">
              <ButtonIcon
                w="100%"
                size="sm"
                leftIcon="edit"
                colorScheme="blue"
                text="Edit"
                onClick={() => {
                  setShowEdit(true);
                  setSelectedData(props.row.original);
                }}
              />
              <ButtonIcon
                w="100%"
                size="sm"
                leftIcon="delete"
                colorScheme="red"
                text="Hapus"
                onClick={() => {
                  onOpenDelete();
                  setSelectedData(props.row.original);
                }}
              />
            </HStack>
          );
        },
      },
    ],
    [setSelectedData, onOpenDelete, setShowEdit]
  );

  return columns;
};

export default useColumn;
