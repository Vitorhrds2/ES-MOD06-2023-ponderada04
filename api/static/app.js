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
            const response = await fetch(`http://127.0.0.1:8000/stories/${storyId}/add_part`, {
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
