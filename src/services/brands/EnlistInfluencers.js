import axios from "axios";

const ENLIST_INFLUENCERS = 'http://192.168.0.123:5000/api/v1/fuzzyListing/enlistInfluencers';

export const getInfluencers = async (token, filters) => {
    try {
        const {
            platform,
            niches,
            minFollowers,
            maxFollowers,
            minEngagement,
            maxEngagement
        } = filters;

        const response = await axios.get(ENLIST_INFLUENCERS, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            params: {
                platform,
                niches,
                minFollowers,
                maxFollowers,
                minEngagement,
                maxEngagement
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch influencers');
    }
}
