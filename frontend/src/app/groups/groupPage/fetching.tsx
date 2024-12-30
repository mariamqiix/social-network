import { GroupPageView, GroupEventResponse } from '../../types/Types';

export async function fetchGroupData(): Promise<GroupPageView> {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string
    const url = `http://localhost:8080/group/page?id=${id}`; // Append the id to the URL

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
        });
        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        // Fetch the group data from the API
        const groupData: GroupPageView = await response.json();
        return groupData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return a default GroupPageView object
        return {
            User: null,
            Posts: [],
            Group: {
                id: 0,
                creator: {
                    id: 0,
                    username: '',
                    nickname: '',
                    email: '',
                    first_name: '',
                    last_name: '',
                    dob: '',
                    bio: '',
                    image_url: ''
                },
                title: '',
                description: '',
                image_url: '',
                is_user_member: false,
                created_at: '',
                group_member: 0
            },
            Members: []
        };
    }
}


import { User } from '../../types/Types';

export async function fetchMembers(): Promise<User[]> {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string
    const url = `http://localhost:8080/group/UsersToInvite?id=${id}`; // Append the id to the URL

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
        });
        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        // Fetch the group data from the API
        const groupData: User[] = await response.json();
        console.log(groupData);
        return groupData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return an empty array
        return [];
    }
}


export async function fetchEventData(): Promise<GroupEventResponse[]> {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string
    const url = `http://localhost:8080/group/event/list/group?id=${id}`;

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
        });
        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }

        // Fetch the group data from the API
        const groupData: GroupEventResponse[] = await response.json();
        return groupData;

    } catch (error) {
        console.error('Error fetching data:', error);
        // If there is an error fetching data, return an empty array
        return [];
    }
}

type GroupInviteRequest = {
    group_id: number;
    user_id: number;
};

export function sendInvite(memberId: number) {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string

    if (!id) {
        console.error('Group ID not found in the query string');
        return;
    }

    const invite: GroupInviteRequest = {
        group_id: parseInt(id, 10),
        user_id: memberId,
    };

    const url = `http://localhost:8080/group/inviteUser`;

    fetch(url, {
        method: 'POST',
        credentials: 'include', // This is the key to include cookies
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invite),
    })
        .then(response => {
            if (response.ok) {
                console.log('Invite sent successfully');
            } else {
                console.error('Failed to send invite');
            }
        })
        .catch(error => {
            console.error('Error sending invite:', error);
        });
}

export async function LeaveGroup() {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string

    if (!id) {
        console.error('Group ID not found in query string');
        return;
    }

    const url = `http://localhost:8080/group/leaveGroup?id=${id}`;

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }
        // window.location.href = `http://localhost:3000/groups/groupPage?id=${id}`

        console.log('Successfully left the group');
        location.replace("http://localhost:3000/groups");

    } catch (error) {
        console.error('Error leaving the group:', error);
    }
}



export async function RequestToJoin() {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id'); // Get the 'id' from the query string

    if (!id) {
        console.error('Group ID not found in query string');
        return;
    }

    const url = `http://localhost:8080/group/requestToJoin?id=${id}`;

    try {
        const response = await fetch(url, {
            credentials: 'include', // This is the key to include cookies
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Error: status code ${response.status}`);
        }        
    } catch (error) {
        console.error('Error requesting the group:', error);
    }
}




