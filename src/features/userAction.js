import { createAsyncThunk } from "@reduxjs/toolkit";

const server = "http://localhost:3001";

export const userLogin = createAsyncThunk(
	"user/userLogin",
	async ({ email, password }, { rejectWithValue }) => {
		return fetch(`${server}/api/v1/user/login`, {
			method: "POST",
			body: JSON.stringify({ email, password }),
			headers: {
				"Content-Type": "application/json",
				mode: "cors",
			},
		})
			.then((data) => data.json())
			.then((mainData) => {
				return mainData;
			})
			.catch((err) => {
				return rejectWithValue(err.message);
			});
	}
);

/**
 *  Redux userProfile action : fetch request returning a promise.
 *  The userProfile action (POST) returns email, firstName, lastName, user id, createdDate & updatedDate if successfull
 */
export const userProfile = createAsyncThunk(
	"user/userProfile",
	async ({ data }, { rejectWithValue }) => {
		return fetch(`${server}/api/v1/user/profile`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
				"Content-Type": "application/json",
				mode: "cors",
			},
		})
			.then((data) => data.json())
			.then((mainData) => {
				return mainData;
			})
			.catch((err) => {
				return rejectWithValue(err.message);
			});
	}
);

/**
 *  Redux userName action : fetch request returning a promise.
 *  The userName action (PUT) requires firstName & lastName parameters, and returns email, firstName, lastName, user id, createdDate & updatedDate if successfull
 */
export const userName = createAsyncThunk(
	"user/userName",
	async ({ firstName, lastName }, { rejectWithValue }) => {
		return fetch(`${server}/api/v1/user/profile`, {
			method: "PUT",
			body: JSON.stringify({ firstName, lastName }),
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
				"Content-Type": "application/json",
				mode: "cors",
			},
		})
			.then((data) => data.json())
			.then((mainData) => {
				return mainData;
			})
			.catch((err) => {
				return rejectWithValue(err.message);
			});
	}
);