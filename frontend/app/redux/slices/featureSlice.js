
const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    feature:{

    },
    isLoading: true
}
export const featureSlice = createSlice({
    name: "feature",
    initialState,
    reducers:{
        setFeature:(state,action)=>{
            state.feature = action.payload
            state.isLoading = false; 
        },
        setLoading:(state,action)=>{
            state.isLoading = action.payload
        }
    }
})

export const {setFeature,setLoading} = featureSlice.actions

export default featureSlice.reducer;