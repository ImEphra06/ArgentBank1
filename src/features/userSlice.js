import { createSlice } from "@reduxjs/toolkit";
import { userLogin, userProfile, userName } from "./userAction";

const initialState = {
	loading: false,
	error: null,
	success: false,
	firstName: null,
	lastName: null,
	id: null,
	email: null,
	createdAt: null,
	updatedAt: null,
	rememberMe: false,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		userLogout: (state) => {
			sessionStorage.removeItem("userToken"); // deletes token from storage
			sessionStorage.removeItem("connected"); // deletes boolean from storage
			localStorage.removeItem("userToken"); // deletes token from storage
			state.loading = false;
			state.error = null;
			state.success = false;
			state.userToken = null;
			state.firstName = null;
			state.lastName = null;
			state.id = null;
			state.email = null;
			state.createdAt = null;
			state.updatedAt = null;
			state.isLogged = false;
		},
		userClear: (state) => {
			state.loading = false;
			state.error = null;
			state.success = false;
		},
		userSetRememberMe: (state) => {
			state.rememberMe = true;
		},
		userResetRememberMe: (state) => {
			state.rememberMe = false;
		},
		userSetError: (state) => {
			state.error = "Error ! Requested page doesn't exist";
		},
		userClearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: {
		// login user
		[userLogin.pending]: (state) => {
			state.loading = true;
			state.error = null;
			state.success = false;
		},
		[userLogin.fulfilled]: (state, { payload }) => {
			state.loading = false;
			if (payload.status === 200) {
				sessionStorage.setItem("userToken", payload.body.token);
				sessionStorage.setItem("connected", true);
				if (state.rememberMe) {
					localStorage.setItem("userToken", payload.body.token);
				}
				state.success = true;
			} else {
				state.success = false;
				state.error = payload;
			}
		},
		[userLogin.rejected]: (state, { payload }) => {
			state.loading = false;
			state.success = false;
			state.error = payload;
		},

		// profile user
		[userProfile.pending]: (state) => {
			state.loading = true;
			state.error = null;
			state.success = false;
		},
		[userProfile.fulfilled]: (state, { payload }) => {
			state.loading = false;
			if (payload.status === 200) {
				state.success = true;
				sessionStorage.setItem("connected", true);
				state.email = payload.body.email;
				state.firstName = payload.body.firstName;
				state.lastName = payload.body.lastName;
				state.id = payload.body.id;
				state.createdAt = payload.body.createdAt;
				state.updatedAt = payload.body.updatedAt;
				state.isLogged = true;
			} else {
				state.success = false;
				state.error = payload;
			}
		},
		[userProfile.rejected]: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
		},

		// name user
		[userName.pending]: (state) => {
			state.loading = true;
			state.error = null;
			state.success = false;
		},
		[userName.fulfilled]: (state, { payload }) => {
			state.loading = false;
			if (payload.status === 200) {
				state.success = true;
				state.email = payload.body.email;
				state.firstName = payload.body.firstName;
				state.lastName = payload.body.lastName;
				state.id = payload.body.id;
				state.createdAt = payload.body.createdAt;
				state.updatedAt = payload.body.updatedAt;
			} else {
				state.success = false;
				state.error = payload;
			}
		},
		[userName.rejected]: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
		},
	},
});

export const {
	userLogout,
	userClear,
	userSetRememberMe,
	userResetRememberMe,
	userSetError,
	userClearError,
} = userSlice.actions;
export default userSlice.reducer;