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
	isLogged: false,
};

// Fonction utilitaire pour enregistrer le token
const saveUserToken = (token, rememberMe) => {
	sessionStorage.setItem("userToken", token);
	sessionStorage.setItem("connected", true);
	if (rememberMe) {
		localStorage.setItem("userToken", token);
	}
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		userLogout: (state) => {
			sessionStorage.removeItem("userToken");
			sessionStorage.removeItem("connected");
			localStorage.removeItem("userToken");

			// Reset complet de l'état utilisateur
			return { ...initialState, isLogged: false };
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
	extraReducers: (builder) => {
		// Factorisation de la gestion d'état asynchrone
		const handlePending = (state) => {
			state.loading = true;
			state.error = null;
			state.success = false;
		};

		const handleFulfilled = (state, { payload }) => {
			state.loading = false;
			if (payload.status === 200) {
				saveUserToken(payload.body.token, state.rememberMe);
				state.success = true;
				state.isLogged = true;
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
		};

		const handleRejected = (state, { payload }) => {
			state.loading = false;
			state.success = false;
			state.error = payload;
		};

		// Application aux différentes actions
		builder
			.addCase(userLogin.pending, handlePending)
			.addCase(userLogin.fulfilled, handleFulfilled)
			.addCase(userLogin.rejected, handleRejected)
			.addCase(userProfile.pending, handlePending)
			.addCase(userProfile.fulfilled, handleFulfilled)
			.addCase(userProfile.rejected, handleRejected)
			.addCase(userName.pending, handlePending)
			.addCase(userName.fulfilled, handleFulfilled)
			.addCase(userName.rejected, handleRejected);
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