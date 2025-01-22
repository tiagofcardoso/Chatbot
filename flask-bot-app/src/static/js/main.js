async function processUrl() {
    const urlInput = document.getElementById('url-input').value;
    try {
        const response = await fetch('/process-url', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: urlInput})
        });
        const data = await response.json();
        if (data.error) {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    
    const message = userInput.value;
    if (!message) return;

    // Add user message
    chatMessages.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    userInput.value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: message})
        });
        const data = await response.json();
        
        // Add bot response
        chatMessages.innerHTML += `<p><strong>Bot:</strong> ${data.response}</p>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleSubmit() {
    const userInput = document.getElementById('user-input');
    const fileInput = document.getElementById('file-input');
    const chatMessages = document.getElementById('chat-messages');
    
    const formData = new FormData();
    
    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    } else if (userInput.value) {
        formData.append('input', userInput.value);
    } else {
        return;
    }

    try {
        const response = await fetch('/process-input', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (data.error) {
            chatMessages.innerHTML += `<div class="error-message">${data.error}</div>`;
        } else {
            chatMessages.innerHTML += `<div class="response-message">${data.response}</div>`;
        }
        
        userInput.value = '';
        fileInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Enable drag and drop
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const fileInput = document.getElementById('file-input');

    userInput.addEventListener('dragover', (e) => {
        e.preventDefault();
        userInput.classList.add('dragover');
    });

    userInput.addEventListener('dragleave', () => {
        userInput.classList.remove('dragover');
    });

    userInput.addEventListener('drop', (e) => {
        e.preventDefault();
        userInput.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleSubmit();
        }
    });

    const attachmentButton = document.getElementById('attachment-btn');
    const attachmentMenu = document.getElementById('attachment-menu');
    const urlButton = document.getElementById('url-btn');
    const urlInput = document.getElementById('url-input');
    
    attachmentButton.addEventListener('click', () => {
        attachmentMenu.classList.toggle('show');
    });

    urlButton.addEventListener('click', () => {
        urlInput.classList.toggle('show');
    });

    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const attachmentBtn = document.getElementById('attachment-btn');
    const attachmentOptions = document.getElementById('attachment-options');
    const chatMessages = document.getElementById('chat-messages');

    // Send message function
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        displayMessage(message, 'outgoing');
        messageInput.value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            if (data.response) {
                displayMessage(data.response, 'incoming');
            }
        } catch (error) {
            console.error('Error:', error);
            displayMessage('Error sending message', 'error');
        }
    }

    function displayMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event Listeners
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    attachmentBtn.addEventListener('click', () => {
        attachmentOptions.classList.toggle('active');
    });

    // Close attachment options when clicking outside
    document.addEventListener('click', (e) => {
        if (!attachmentBtn.contains(e.target) && !attachmentOptions.contains(e.target)) {
            attachmentOptions.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    async function sendMessage() {
        console.log('sendMessage called'); // Debug
        const message = messageInput.value.trim();
        
        if (!message) {
            console.log('No message to send'); // Debug
            return;
        }

        console.log('Sending message:', message); // Debug

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            console.log('Response status:', response.status); // Debug

            const data = await response.json();
            console.log('Response data:', data); // Debug

            if (data.response) {
                // Add user message
                addMessage(message, 'outgoing');
                // Add bot response
                addMessage(data.response, 'incoming');
                // Clear input
                messageInput.value = '';
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Error sending message', 'error');
        }
    }

    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event Listeners
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage();
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sendMessage();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const attachmentBtn = document.getElementById('attachment-btn');
    const attachmentMenu = document.getElementById('attachment-menu');
    const pdfInput = document.getElementById('pdf-input');
    const imageInput = document.getElementById('image-input');
    const urlOption = document.getElementById('url-option');
    const youtubeOption = document.getElementById('youtube-option');

    attachmentBtn.addEventListener('click', () => {
        attachmentMenu.classList.toggle('active');
    });

    async function handleFileUpload(file, type) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        try {
            const response = await fetch('/upload-file', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.response) {
                displayMessage(data.response, 'incoming');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    pdfInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            handleFileUpload(e.target.files[0], 'pdf');
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            handleFileUpload(e.target.files[0], 'image');
        }
    });

    async function handleURLInput(type) {
        const url = prompt(`Enter ${type} URL:`);
        if (!url) return;

        try {
            const response = await fetch('/process-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url, type })
            });
            const data = await response.json();
            if (data.response) {
                displayMessage(data.response, 'incoming');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    urlOption.addEventListener('click', () => handleURLInput('url'));
    youtubeOption.addEventListener('click', () => handleURLInput('youtube'));
});