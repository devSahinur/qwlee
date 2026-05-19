
const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    user:{},
    isLoading:true,
    value:0
}
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload
            state.isLoading = false; 
        },
        setLoading:(state,action)=>{
            state.isLoading = action.payload
        }
    }
})

export const {setUser,setLoading} = userSlice.actions

export default userSlice.reducer;