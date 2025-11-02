import { createNewCommunity } from "../services/communityServices.js";

// Create a new community
export const createCommunity = async (req, res) => {
	try {
		const communityData = req.body;
		const newCommunity = await createNewCommunity({
			...communityData,
			createdBy: req.auth.userId,
			communityAdmin: req.auth.userId,
			members: [req.auth.userId],
		});
		res.status(201).json({ message: "Success", community: newCommunity });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
