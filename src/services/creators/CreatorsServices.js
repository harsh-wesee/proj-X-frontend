import axios from 'axios';



const API_BASE_URL = 'http://localhost:5000/api/v1';

// Function to handle API registration
export const registerUser = async (registrationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, registrationData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Handle successful registration
        console.log('Registration successful:', response.data);
        const token = response.data.token;
        console.log("Token", token);
        localStorage.setItem('jwt', token);
        return response.data;
    } catch (error) {
        // Handle registration error
        console.error('Registration failed:', error.response ? error.response.data : error.message);

        // Show user-friendly error message
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            alert(error.response.data.message || 'Registration failed. Please try again.');
        } else if (error.request) {
            // The request was made but no response was received
            alert('No response from server. Please check your internet connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            alert('Error in registration process. Please try again.');
        }

        throw error;
    }
};


export const registerChannelDetails = async (channelDetails) => {
    try {
        console.log("Channel Details before API", channelDetails);
        const fetchToken = localStorage.getItem('jwt');
        const response = await axios.post(`${API_BASE_URL}/channelOnboarding/uploadChannelDetails`, channelDetails, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${fetchToken}`
            }
        });
        console.log('Channel Details Submitted');
        return response.data;
    } catch (error) {
        console.error('Registration failed', error.response ? error.response.data : error.message);
        if (error.response) {
            alert(error.response.data.message || 'Channel Details Submission failed. Try Again!');
        } else if (error.request) {
            // The request was made but no response was received
            alert('No response from server. Please check your internet connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            alert('Error in registration process. Please try again.');
        }
        throw error;
    }
}

export const creatorLogin = async (email, password) => {
    let data = JSON.stringify({
        "email": email,
        "password": password
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_BASE_URL}/auth/login`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        return response; // Return the full response object
    } catch (error) {
        console.error('Login API failed:', error);
        alert(`Login failed. Please try again. ${error.message}`);
        throw error; // Rethrow the error so the caller knows about it
    }
}



export const fetchCreatorProfile = async (token) => {
    try {
        // Retrieve the JWT token from localStorage or cookies// Adjust storage retrieval as needed

        // Make the API request
        const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
            },
        });

        // Return the profile data
        console.log(response.data);
        return response;
    } catch (error) {
        console.error('Error fetching creator profile:', error);
        // Handle errors appropriately
        if (error.response && error.response.status === 404) {
            throw new Error('Creator not found');
        } else if (error.response && error.response.status === 401) {
            throw new Error('Unauthorized access');
        } else {
            throw new Error('Server error fetching profile');
        }
    }
};

export const fetchCreatorsChannelData = async (token) => {
    try {
        // Make the API request
        const response = await axios.get(`${API_BASE_URL}/channelOnboarding/getChannelDetails`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
            },
        });

        // Return the profile data
        console.log(response.data);
        return response;
    } catch (error) {
        console.error('Error fetching creator profile:', error);
        // Handle errors appropriately
        if (error.response && error.response.status === 404) {
            throw new Error('Creator not found');
        } else if (error.response && error.response.status === 401) {
            throw new Error('Unauthorized access');
        } else {
            throw new Error('Server error fetching profile');
        }
    }
};

export const searchCampaigns = async (searchParams) => {
    const token = localStorage.getItem('jwt');
    console.log(token)

    try {
        // Construct query parameters
        const queryParams = new URLSearchParams({
            ...(searchParams.search && { search: searchParams.search }),
            ...(searchParams.startDate && { startDate: searchParams.startDate }),
            ...(searchParams.endDate && { endDate: searchParams.endDate }),
            ...(searchParams.minBudget && { minBudget: searchParams.minBudget }),
            ...(searchParams.maxBudget && { maxBudget: searchParams.maxBudget }),
            page: searchParams.page || 1,
            limit: searchParams.limit || 20
        });

        const response = await axios.get(`${API_BASE_URL}/fuzzySearch/campaignSearch?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error searching campaigns:', error);
        if (error.response && error.response.status === 401) {
            throw new Error('Unauthorized access');
        } else {
            throw new Error('Error searching campaigns: ' + (error.response?.data?.message || error.message));
        }
    }
};


