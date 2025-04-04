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
    sessionStorage.setItem("connected", "true");
    if (rememberMe) {
        localStorage.setItem("userToken", token);
        localStorage.setItem("connected", "true");
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
            localStorage.removeItem("connected");

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
        // Nouvelle action pour vérifier les tokens persistants
        checkPersistedAuth: (state) => {
            const sessionToken = sessionStorage.getItem("userToken");
            const localToken = localStorage.getItem("userToken");
            
            if (sessionToken || localToken) {
                state.isLogged = true;
                // Restaurer la valeur "connected" pour le Header
                sessionStorage.setItem("connected", "true");
            }
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
            console.log("🟢 userLogin fulfilled - API response:", payload);

            state.loading = false;
            if (payload.status === 200) {
                console.log("✅ Success! Token received:", payload.body.token);
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
                console.error("🔴 API responded with an error:", payload);
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
            .addCase(userProfile.fulfilled, (state, action) => {
                const userData = action.payload.body;  // Extraire "body"
                state.firstName = userData.firstName;
                state.lastName = userData.lastName;
                state.email = userData.email;
                state.id = userData.id;
                state.createdAt = userData.createdAt;
                state.updatedAt = userData.updatedAt;
            })
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
    checkPersistedAuth,
} = userSlice.actions;
export default userSlice.reducer;