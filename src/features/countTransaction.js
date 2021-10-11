import { createSlice } from '@reduxjs/toolkit'
// import { axiosClient } from 'networks'

const initialState = {
    data: []
}

export const transction = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        getCountTransaction: (state, action) => {
            console.log(action.payload)
            state.data = [{ "A": action.paylod }]
            return [{ a: action.payload }]
        }
        //     axiosClient.get("/api/v1/count-transaction")
        //         .then(res => ["asd"])
        //         .catch(err => console.log("error", err))
    },
})

// Action creators are generated for each case reducer function
export const { getCountTransaction } = transction.actions

export default transction.reducer