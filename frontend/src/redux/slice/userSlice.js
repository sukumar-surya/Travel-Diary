import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    currentUser: null,
    loading: null,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
            state.error = null
        },
        signInSuccess: (state, action) => {
            state.loading = false
            state.currentUser = action.payload
            state.error = null
        },
        signInFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },

        signOutSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
    }
});

export const { signInStart, signInSuccess, signInFailure, signOutSuccess } = userSlice.actions;
export default userSlice.reducer;