import React from "react";
import {
    Box,
    Input
} from "@chakra-ui/react";

export default function EditTableInput() {
    const [isEdit, setIsEdit] = React.useState(false)
    const [value, setValue] = React.useState("Anonim")
    const inputRef = React.useRef()
    const handleBlur = (e) => {
        setIsEdit(false)
        setValue(inputRef.current.value || value)
    }
    if (isEdit)
        return (
            <Box>
                <Input
                    ref={inputRef}
                    onBlur={handleBlur} />
            </Box>
        )
    return (
        <td onDoubleClick={() => setIsEdit(true)}>{value}</td>
    )
}
