import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DisplayUser } from "./models/DisplayUser.interface";
import { Jwt } from "./models/Jwt";
import { NewUser } from "./models/NewUser";
import authService from "./services/auth.service";

interface AsyncState {
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean
}

interface AuthState extends AsyncState {
    user?: DisplayUser | null;
    jwt?: Jwt;
    isAuthenticated?: boolean;
}

const initialState: AuthState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    user: null,
    jwt: null,
    isAuthenticated: false,

}

export const register = createAsyncThunk(
    'auth/register',
    async(user: NewUser, thunkApi)=> {
        try {
            return await authService.register(user);
        } catch (error) {
            return thunkApi.rejectWithValue("Unable to register")
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {

    },
    extraReducers: (builder) => {
        builder
        // REGISTER
        .addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        .addCase(register.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
            state.user = null;
        })

    }

});

export default authSlice.reducer;