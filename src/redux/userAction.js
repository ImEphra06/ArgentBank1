import { createAsyncThunk } from "@reduxjs/toolkit";
import { userLogout } from "./userSlice";

const SERVER_URL = "http://localhost:3001/api/v1/user/";

// Fonction utilitaire pour les requêtes API
const fetchAPI = async (endpoint, method = "GET", body = null, auth = false) => {
	try {
		const headers = {
			"Content-Type": "application/json",
		};

		if (auth) {
			// Vérifier d'abord le token de sessionStorage
			let token = sessionStorage.getItem("userToken");
			
			// Si pas de token dans sessionStorage, vérifier localStorage (pour Remember Me)
			if (!token) {
				token = localStorage.getItem("userToken");
			}
			
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			} else {
				throw new Error("Token d'authentification non trouvé");
			}
		}

		const response = await fetch(`${SERVER_URL}/${endpoint}`, {
			method,
			body: body ? JSON.stringify(body) : null,
			headers,
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || "Une erreur est survenue");
		}

		return data;
	} catch (error) {
		throw new Error(error.message);
	}
};

// Action pour la connexion
export const userLogin = createAsyncThunk(
	"user/userLogin",
	async ({ email, password }, { rejectWithValue }) => {
		try {
			return await fetchAPI("login", "POST", { email, password });
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Action pour récupérer le profil utilisateur
export const userProfile = createAsyncThunk(
	"user/userProfile",
	async (arg, { rejectWithValue, dispatch }) => {
		try {
			// Si un token spécifique est fourni (comme lors de la vérification au démarrage),
			// on peut le stocker temporairement dans sessionStorage
			if (arg && arg.token) {
				const currentToken = sessionStorage.getItem("userToken");
				if (!currentToken) {
					sessionStorage.setItem("userToken", arg.token);
				}
			}

			const data = await fetchAPI("profile", "POST", null, true);
			return data;
		} catch (error) {
			if (error.message.includes("unauthorized") || error.message.includes("token")) {
				// Déconnexion automatique en cas de problème d'authentification
				dispatch(userLogout());
			}
			return rejectWithValue(error.message);
		}
	}
);

// Action pour mettre à jour le nom
export const userName = createAsyncThunk(
	"user/userName",
	async ({ firstName, lastName }, { rejectWithValue }) => {
		try {
			return await fetchAPI("profile", "PUT", { firstName, lastName }, true);
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);