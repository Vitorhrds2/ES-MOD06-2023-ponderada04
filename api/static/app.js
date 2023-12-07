let token = null;
let userId = null;

async function registerUser() {
    const username = prompt("Enter your username:");
    const email = prompt("Enter your email:");
    if (username && email) {
        const response = await fetch('http://127.0.0.1:8000/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: 'password',  // You should implement proper authentication
            }),
        });
        const user = await response.json();
        if (user.id) {
            token = user.id;
            userId = user.id;
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('username').innerText = username;
        }
    }
}

async function loginUser() {
    const username = prompt("Enter your username:");
    if (username) {
        const response = await fetch(`http://127.0.0.1:8000/users/${username}`);
        const user = await response.json();
        if (user) {
            token = user.id;
            userId = user.id;
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('username').innerText = username;
        }
    }
}

function logoutUser() {
    token = null;
    userId = null;
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

    const response = await fetch(`http://127.0.0.1:8000/stories/`, {
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
}

async function completeStory() {
    const storyId = prompt("Enter the story ID:");
    const promptText = prompt("Enter the prompt for story completion:");

    if (storyId && promptText) {
        const response = await fetch(`http://127.0.0.1:8000/stories/${storyId}/add_part`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ prompt: promptText }),
        });

        const result = await response.json();

        if (response.ok) {
            // Assuming that your story object has properties like 'title', 'description', 'category', 'content'
            document.getElementById('story-container').innerHTML = `<h3>${result.title}</h3>
            <p>Description: ${result.description}</p>
            <p>Category: ${result.category}</p>
            <p>Content: ${result.content}</p>`;
        } else {
            alert(`Error: ${result.detail}`);
        }
    }

}



function displayStory(story) {
    const storyContainer = document.getElementById('story-container');
    storyContainer.innerHTML = `<h3>${story.title}</h3>
                                <p>Description: ${story.description}</p>
                                <p>Category: ${story.category}</p>
                                <p>Content: ${story.content}</p>`;
}
