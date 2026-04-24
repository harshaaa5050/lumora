import axios from "axios";

const BASE = `${import.meta.env.VITE_BACKEND_URL}/user/community`;

const headers = () => ({ "Content-Type": "application/json" });

const handle = async (request) => {
	try {
		const { data } = await request;
		return data;
	} catch (error) {
		throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || "Request failed");
	}
};

export const getCommunity = (communityId) =>
	handle(axios.get(`${BASE}/${communityId}`, { withCredentials: true, headers: headers() }));

export const joinCommunity = (communityId) =>
	handle(axios.patch(`${BASE}/join/${communityId}`, {}, { withCredentials: true, headers: headers() }));

export const leaveCommunity = (communityId) =>
	handle(axios.patch(`${BASE}/leave/${communityId}`, {}, { withCredentials: true, headers: headers() }));
