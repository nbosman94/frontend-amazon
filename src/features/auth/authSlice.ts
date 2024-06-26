import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { DisplayUser } from "./models/DisplayUser.interface";
import { Jwt } from "./models/Jwt";
import { LoginUser } from "./models/LoginUser.interface";
import { NewUser } from "./models/NewUser";
import authService from "./services/auth.service";

const storedUser: string| null = localStorage.getItem('user');
const user: DisplayUser | null = !!storedUser ? JSON.parse(storedUser) : null;


const storedJwt: string | null = localStorage.getItem('jwt');
const jwt: Jwt | null = !!storedJwt ? JSON.parse(storedJwt) : null;


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
    // user and jwt are coming from local storage
    user: user,
    jwt: jwt,
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


export const login = createAsyncThunk(
    'auth/login',
    async(user: LoginUser, thunkApi)=> {
        try {
            return await authService.login(user);
        } catch (error) {
            return thunkApi.rejectWithValue("Unable to login")
        }
    }
)


export const logout = createAsyncThunk(
    'auth/logout',
    async()=> {
        await authService.logout();
    }
)


export const verifyJwt = createAsyncThunk(
    'auth/verify-jwt',
    async(jwt: string, thunkApi)=> {
        try {
            return await authService.verifyJwt(jwt);
        } catch (error) {
            return thunkApi.rejectWithValue("Unable to verify jwt")
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
        }

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

        // LOGIN
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.jwt = action.payload.jwt;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        })
        .addCase(login.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
            state.isAuthenticated = false;
            state.user = null;
        })
        // LOGOUT
        .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.jwt = null;
            state.isAuthenticated = false;
        })
        // VERIFY
        .addCase(verifyJwt.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(verifyJwt.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isAuthenticated = action.payload;
        })
        .addCase(verifyJwt.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
            state.isAuthenticated = false;
        })

    }

});
export const {reset} = authSlice.actions;
export const selectedUser = (state: RootState) => {
    return state.auth;
}
export default authSlice.reducer;