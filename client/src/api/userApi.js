import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL;

const headers = () => ({
	"Content-Type": "application/json",
});

const handle = async (request) => {
	try {
		const { data } = await request;
		return data;
	} catch (error) {
		throw new Error(error.response?.data?.message || error.message || "Request failed");
	}
};

export const getUserProfile = () =>
	handle(axios.get(`${BASE}/user/profile`, { withCredentials: true, headers: headers() }));

export const getTodos = () =>
	handle(axios.get(`${BASE}/user/todo`, { withCredentials: true, headers: headers() }));

export const getCompletedTodos = () =>
	handle(axios.get(`${BASE}/user/todo/completed`, { withCredentials: true, headers: headers() }));

export const addTodo = (body) =>
	handle(axios.post(`${BASE}/user/todo`, body, { withCredentials: true, headers: headers() }));

export const editTodo = (todoId, body) =>
	handle(axios.put(`${BASE}/user/todo/${todoId}`, body, { withCredentials: true, headers: headers() }));

export const deleteTodo = (todoId) =>
	handle(axios.delete(`${BASE}/user/todo/${todoId}`, { withCredentials: true, headers: headers() }));

export const toggleTodo = (todoId) =>
	handle(axios.patch(`${BASE}/user/todo/completed/${todoId}`, {}, { withCredentials: true, headers: headers() }));

export const getJoinedCommunities = () =>
	handle(axios.get(`${BASE}/user/communities`, { withCredentials: true, headers: headers() }));

export const getPublicCommunities = () =>
	handle(axios.get(`${BASE}/user/public-communities`, { withCredentials: true, headers: headers() }));
