import { createAsyncThunk } from "@reduxjs/toolkit";

const SERVER_URL = "http://localhost:3001/api/v1/user/";

// Fonction utilitaire pour les requêtes API
const fetchAPI = async (endpoint, method = "GET", body = null, auth = false) => {
	try {
		const headers = {
			"Content-Type": "application/json",
		};

		if (auth) {
			const token = sessionStorage.getItem("userToken");
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
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
	async (_, { rejectWithValue }) => {
		try {
			const data = await fetchAPI("profile", "POST", null, true);
			console.log("Profile API Response:", data); // Ajout du log ici
			return data;
		} catch (error) {
			console.error("Error fetching profile:", error.message);
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