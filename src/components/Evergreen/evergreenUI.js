import React, { useEffect, useState } from "react";
import { Button, Pane, Text, majorScale, Spinner, HorizontalBarChartAscIcon } from 'evergreen-ui';
import useSwr from "swr"
import { axiosClient } from "networks"

const words = ["This is a clickable Button", "Do you know this is a clickable button?", "Hey clik it!", "I know you can click", "< Click!"]

const fetcher = (url) => axiosClient.get(url).then(res => res.data.data)
const fetcherMurni = url => fetch(url).then(res => res.data)
export default function Evergreen() {
    const [word, setWord] = useState("")
    const [text, setText] = useState("")

    const { data } = useSwr('/api/v1/dashboard/count-transaction', fetcher)
    const movies = useSwr("https://app.swaggerhub.com/apis/putrasatr/Squelize-movies-API/1.0.0#/movies", fetcherMurni)
    console.log(movies)
    useEffect(() => {
        setText("")
        for (let i = 0; i < word.length; i++) {
            setTimeout(() => {
                setText(t => t + word[i])
            }, 200)
        }
    }, [word])

    return (
        <>
            <Pane display="flex" alignItems="center" marginX={majorScale(3)}>
                <Button onClick={() => setWord(words[Math.random() * words.length | 0])}>Click me!</Button>
                <HorizontalBarChartAscIcon />
                <Text>{text}</Text>
                <Spinner />

            </Pane>
            <Text>👁 {data?.result.success}</Text>
            <Text>✨ {data?.result.failed}</Text>
            <Text>🍴 {data?.result.unprocessed}</Text>
        </>
    )
}