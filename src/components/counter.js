import React from 'react'
import { Stack, Button, Text, Box } from "@chakra-ui/react";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../features'
import { getCountTransaction } from '../features/countTransaction'

export default function Counter() {
    const count = useSelector(({ counter }) => counter?.value)
    const data = useSelector(({ transaction }) => transaction?.data)
    const dispatch = useDispatch()
    console.log(data)
    return (
        <Box>
            <Stack direction="row">
                <Button
                    onClick={() => dispatch(increment())}
                >
                    Increment
                </Button>
                <Text>{count}</Text>
                <Button
                    onClick={() => dispatch(decrement())}
                >
                    Decrement
                </Button>
            </Stack>
            <Button
                onClick={() => dispatch(getCountTransaction("GET"))}>
                Get Data
            </Button>
        </Box>
    )
}