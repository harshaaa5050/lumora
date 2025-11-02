import Community from "../models/CommunityDB/Community.js";
import UserMetadata from "../models/UserDB/UserMetadata.js";

// Create a new community
export const createNewCommunity = async (communityData) => {
	const newCommunity = new Community(communityData);
	const existingCommunity = await Community.findOne({
		communityId: communityData.communityId,
	});
	if (existingCommunity) throw new Error("CommunityId already exists");
	const savedCommunity = await newCommunity.save();
	if (!savedCommunity) throw new Error("Failed to create community");
	const userMetadata = await UserMetadata.findOne({
		userId: savedCommunity.createdBy,
	});
	if (!userMetadata) throw new Error("User metadata not found");
	userMetadata.joinedCommunities.push(savedCommunity._id);
	const savedMetadata = await userMetadata.save();
	if (!savedMetadata) throw new Error("Failed to update user metadata");
	return savedCommunity;
};

// CommunityId existence check
export const checkCommunityIdExistence = async (communityId) => {
    const existingCommunity = await Community.findOne({ communityId });
    return !!existingCommunity;
};