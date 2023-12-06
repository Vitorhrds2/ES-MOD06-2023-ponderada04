let token = null;
let userId = null;

async function registerUser() {
    const username = prompt("Enter your username:");
    const email = prompt("Enter your email:");

    if (username && email) {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: 'password',  // Implement proper authentication
                }),
            });

            const user = await response.json();

            if (user.id) {
                token = user.id;
                userId = user.id;

                document.getElementById('auth-section').style.display = 'none';
                document.getElementById('story-section').style.display = 'block';
                document.getElementById('user-info').style.display = 'block';
                document.getElementById('username').innerText = username;
            } else {
                alert("Failed to register user. Please try again.");
            }
        } catch (error) {
            console.error("Error during user registration:", error);
            alert("An error occurred during user registration. Please try again.");
        }
    }
}


async function loginUser() {
    const userId = prompt("Enter your user ID:");

    if (userId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${userId}`);
            const user = await response.json();

            if (user) {
                token = user.id;

                document.getElementById('auth-section').style.display = 'none';
                document.getElementById('story-section').style.display = 'block';
                document.getElementById('user-info').style.display = 'block';
                document.getElementById('username').innerText = user.username;
            } else {
                alert("User not found. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error during user login:", error);
            alert("An error occurred during user login. Please try again.");
        }
    }
}


function logoutUser() {
    token = null;
    userId = null;

    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('story-section').style.display = 'none';
    document.getElementById('user-info').style.display = 'none';
}

async function createStory() {
    if (!token) {
        alert("Please login first.");
        return;
    }

    const title = prompt("Enter the title of the story:");
    const description = prompt("Enter the description of the story:");
    const category = prompt("Enter the category of the story:");
    const content = prompt("Enter the content of the story:");

    try {
        const response = await fetch(`http://127.0.0.1:8000/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                description: description,
                category: category,
                content: content,
            }),
        });

        const story = await response.json();

        displayStory(story);
    } catch (error) {
        console.error("Error during story creation:", error);
        alert("An error occurred during story creation. Please try again.");
    }
}

async function completeStory() {
    const storyId = prompt("Enter the story ID:");
    const promptText = prompt("Enter the prompt for story completion:");

    if (storyId && promptText) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/stories/${storyId}/add_part?prompt=${promptText}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    prompt: {
                        text: promptText,
                        isContinuation: true,  // You may adjust these properties as needed
                        promptType: "user",
                        numTokens: 100,
                        maxTokens: 100
                    },
                    length: 200
                }),
            });

            const result = await response.json();

            if (response.ok) {
                displayStory(result);
            } else {
                alert(`Error: ${result.detail}`);
            }
        } catch (error) {
            console.error("Error during story completion:", error);
            alert("An error occurred during story completion. Please try again.");
        }
    }
}


function displayStory(story) {
    const storyContainer = document.getElementById('story-container');
    storyContainer.innerHTML = `<h1>Story ID${story.id}</h1>
                                <h3>${story.title}</h3>
                                <p>Description: ${story.description}</p>
                                <p>Category: ${story.category}</p>
                                <p>Content: ${story.content}</p>`;
}

async function listAllStories() {
    try {
        const response = await fetch('http://127.0.0.1:8000/stories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const stories = await response.json();

        if (response.ok) {
            displayStoriesList(stories);
        } else {
            alert(`Error: ${stories.detail}`);
        }
    } catch (error) {
        console.error("Error while fetching stories:", error);
        alert("An error occurred while fetching stories. Please try again.");
    }
}

async function listSpecificStory(storyId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/stories/${storyId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const story = await response.json();

        if (response.ok) {
            displayStory(story);
        } else {
            alert(`Error: ${story.detail}`);
        }
    } catch (error) {
        console.error("Error while fetching a specific story:", error);
        alert("An error occurred while fetching the story. Please try again.");
    }
}

async function updateStory(storyId) {
    const newContent = prompt("Enter the updated title of the story:");
    const newContent2 = prompt("Enter the updated description of the story:");
    const newContent3 = prompt("Enter the updated category of the story:");
    const newContent4 = prompt("Enter the updated content of the story:");

    if (newContent) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/stories/${storyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newContent,
                    description: newContent2,
                    category: newContent3,
                    content: newContent4,
                }),
            });

            const updatedStory = await response.json();

            if (response.ok) {
                displayStory(updatedStory);
            } else {
                alert(`Error: ${updatedStory.detail}`);
            }
        } catch (error) {
            console.error("Error during story update:", error);
            alert("An error occurred during story update. Please try again.");
        }
    }
}

async function deleteStory(storyId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/stories/${storyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const deletedStory = await response.json();

        if (response.ok) {
            alert(`Story ID ${deletedStory.id} deleted successfully.`);
            removeStoryFromList(storyId);  // Remova a história da lista em tempo real
        } else {
            alert(`Error: ${deletedStory.detail}`);
        }
    } catch (error) {
        console.error("Error during story deletion:", error);
        alert("An error occurred during story deletion. Please try again.");
    }
}

function removeStoryFromList(storyId) {
    const storyListContainer = document.getElementById('story-container');
    const storyItem = document.getElementById(`story-${storyId}`);
    
    if (storyItem) {
        storyListContainer.removeChild(storyItem);
    }
}

function displayStoriesList(stories) {
    const storyListContainer = document.getElementById('story-container');
    storyListContainer.innerHTML = '<h3>All Stories</h3>';
    
    if (stories.length === 0) {
        storyListContainer.innerHTML += '<p>No stories available.</p>';
    } else {
        stories.forEach((story) => {
            storyListContainer.innerHTML += `<div id="story-${story.id}">
                                                <p>${story.title} - 
                                                    <button class="btn-primary" onclick="listSpecificStory(${story.id})">View</button> 
                                                    <button class="btn-success" onclick="updateStory(${story.id})">Update</button> 
                                                    <button class="btn-danger" onclick="deleteStory(${story.id})">Delete</button>
                                                </p>
                                            </div>`;
        });
    }
}
