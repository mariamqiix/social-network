import { ProfilePageView } from '../types/Types';

export async function fetchProfileData(): Promise<ProfilePageView> {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string
    const url = `http://localhost:8080/profile/`; // Append the id to the URL

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // This is the key to include cookies
            body: JSON.stringify({ user_id: -1 })
        });
        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        // Fetch the group data from the API
        const userData: ProfilePageView = await response.json();
        return userData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return a default GroupPageView object
        return {
            user: null,
            Posts: [],
            LikedPosts: [],
            DislikedPosts: [],
            Followers: []
        };
    }
}