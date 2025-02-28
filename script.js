// DOM elements
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const categoryList = document.getElementById('categoryList');
const postList = document.getElementById('postList');
const newPostBtn = document.getElementById('newPostBtn');

// Function to save user data in localStorage
if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Get existing users or create empty array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user already exists
        const userExists = users.find(user => user.email === email);
        if (userExists) {
            alert('Email sudah terdaftar. Silakan gunakan email lain.');
            return;
        }
        
        // Add new user
        users.push({
            username,
            email,
            password // In a real app, you should hash this password
        });
        
        // Save updated users array
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Pendaftaran berhasil! Silakan login.');
        window.location.href = 'login.html';
    });
}

// Function to handle user login
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user with matching credentials
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Save logged in user info
            localStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                email: user.email
            }));
            
            alert('Login berhasil!');
            window.location.href = 'forum.html';
        } else {
            alert('Email atau password salah!');
        }
    });
}

// Function to check if user is logged in
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // If on forum page and not logged in, redirect to login
    if (window.location.pathname.includes('forum.html') && !currentUser) {
        alert('Silakan login terlebih dahulu.');
        window.location.href = 'login.html';
    }
}

// Sample categories data
const categories = [
    { id: 1, name: 'sekolah', postCount: },
    { id: 2, name: 'running', postCount:  },
    { id: 3, name: 'Musik', postCount:  },
    { id: 4, name: 'all', postCount:  }
];

// Function to create new post
function createNewPost() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
        alert('Silakan login terlebih dahulu.');
        return;
    }
    
    // In a real app, this would be a modal or new page
    const title = prompt('Judul diskusi:');
    const content = prompt('Isi diskusi:');
    const category = prompt('Kategori (emel, running, musik, all):');
    
    if (title && content && category) {
        // Create post element
        const postElement = document.createElement('div');
        postElement.className = 'card mb-3';
        postElement.innerHTML = `
            <div class="card-header d-flex justify-content-between">
                <span>@${currentUser.username}</span>
                <small>Baru saja</small>
            </div>
            <div class="card-body">
                <h5 class="card-title text-dark">${title}</h5>
                <p class="card-text text-dark">${content}</p>
                <div class="d-flex justify-content-between">
                    <span class="badge bg-secondary">${category}</span>
                    <div>
                        <button class="btn btn-sm btn-outline-primary">Komentar (0)</button>
                        <button class="btn btn-sm btn-outline-success">Suka (0)</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add to posts list
        if (postList) {
            postList.prepend(postElement);
        }
    }
}

// Forum chat functionality
// Current active channel
let currentChannel = 'emel';

// Function to format time
function formatTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// Function to add chat message
function addChatMessage(message, isCurrentUser = true, username = null, isSystem = false) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    
    if (isSystem) {
        messageElement.className = 'message system-message';
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
        `;
    } else {
        messageElement.className = `message ${isCurrentUser ? 'user-message' : 'other-message'}`;
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Guest' };
        const displayName = username || (isCurrentUser ? currentUser.username : 'Lain');
        const time = formatTime();
        
        messageElement.innerHTML = `
            <div class="message-header">
                <strong>${displayName}</strong>
                <small>${time}</small>
            </div>
            <div class="message-content">${message}</div>
        `;
    }
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
// Function to change channel
function changeChannel(channel) {
    currentChannel = channel;
    const channelNameElement = document.getElementById('currentChannel');
    if (channelNameElement) {
        channelNameElement.textContent = channel.charAt(0).toUpperCase() + channel.slice(1);
    }
    
    // Clear chat messages
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    
    // Add welcome message
    addChatMessage(`Selamat datang di channel ${channel}!`, false, 'Admin', true);
    
    // Add sample messages based on channel
    const channelMessages = {
        emel: [
            { user: 'Admin', message: 'Silahkan diskusi apapun di sini!' }
        ],
       sekolah: [
            { user: 'Admin', message: 'Channel untuk diskusi sekolah' }
        ],
       running: [
            { user: 'Admin', message: 'Channel untuk diskusi olahraga' }
        ],
        musik: [
            { user: 'Admin', message: 'Channel untuk diskusi musik' }
        ],
        all: [
            { user: 'Admin', message: 'Channel untuk diskusi all topik' }
        ]
    };
    
    // Add sample messages
    if (channelMessages[channel]) {
        channelMessages[channel].forEach(msg => {
            addChatMessage(msg.message, false, msg.user);
        });
    }
    
    // Update active channel in UI
    const channelItems = document.querySelectorAll('#channelList .list-group-item');
    channelItems.forEach(item => {
        if (item.getAttribute('data-channel') === channel) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Handle sending message
function handleSendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    const message = chatInput.value.trim();
    if (message) {
        // Add user message
        addChatMessage(message, true);
        
        // Clear input
        chatInput.value = '';
        
        // Simulate response in certain channels (in a real app, this would be from a backend)
        if (Math.random() > 0.6) {
            setTimeout(() => {
                const channelResponses = {
                    emel: [
                        'Halo! Apa kabar?',
                        'Selamat datang di forum kami!',
                        'Terima kasih atas partisipasinya!'
                    ],
                   sekolah: [
                        'Halo! Apa kabar?',
                        'Selamat datang di forum kami!',
                        'Terima kasih atas partisipasinya!'
                    ],
                   running: [
                        'Halo! Apa kabar?',
                        'Selamat datang di forum kami!',
                        'Terima kasih atas partisipasinya!'
                    ],
                    musik: [
                        'Halo! Apa kabar?',
                        'Selamat datang di forum kami!',
                        'Terima kasih atas partisipasinya!'
                    ],
                    all: [
                        'Halo! Apa kabar?',
                        'Selamat datang di forum kami!',
                        'Terima kasih atas partisipasinya!'
                    ]
                };
                
                const responses = channelResponses[currentChannel] || channelResponses.emel;
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
                
                addChatMessage(randomResponse, false, randomUser);
            }, 1000 + Math.random() * 2000);
        }
    }
}

// Function to add emoji to input
function addEmojiToInput(emoji) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value += emoji;
        chatInput.focus();
    }
}

// Handle comment button clicks
function handleCommentClick(event) {
    const postId = event.target.getAttribute('data-post-id');
    const commentText = prompt('Tambahkan komentar Anda:');
    
    if (commentText && commentText.trim()) {
        alert(`Komentar berhasil ditambahkan ke postingan #${postId}`);
        // In a real app, you would save this comment to a database
    }
}

// Handle like button clicks
function handleLikeClick(event) {
    const postId = event.target.getAttribute('data-post-id');
    alert(`Anda menyukai postingan #${postId}`);
    // In a real app, you would save this like to a database
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Set current username in the UI
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentUsername = document.getElementById('currentUsername');
    if (currentUser && currentUsername) {
        currentUsername.textContent = currentUser.username;
    }
    
    // New post button functionality
    if (newPostBtn) {
        newPostBtn.addEventListener('click', createNewPost);
    }
    
    // Chat send message button
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', handleSendMessage);
    }
    
    // Chat input enter key
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleSendMessage();
            }
        });
        
        // Focus on chat input when page loads
        chatInput.focus();
    }
    
    // Channel selection
    const channelItems = document.querySelectorAll('#channelList .list-group-item');
    channelItems.forEach(item => {
        item.addEventListener('click', function() {
            const channel = this.getAttribute('data-channel');
            if (channel) {
                changeChannel(channel);
            }
        });
    });
    
    // Emoji buttons
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    emojiButtons.forEach(button => {
        button.addEventListener('click', function() {
            addEmojiToInput(this.textContent);
        });
    });
    
    // Initialize with default channel
    if (document.getElementById('chatMessages')) {
        changeChannel('emel');
    }
    
    // Add event listeners to comment buttons
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(button => {
        button.addEventListener('click', handleCommentClick);
    });
    
    // Add event listeners to like buttons
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', handleLikeClick);
    });
    
    // Toggle user status for demo purposes
    const userStatus = document.getElementById('userStatus');
    if (userStatus) {
        userStatus.addEventListener('click', function() {
            if (this.textContent === 'Online') {
                this.textContent = 'Away';
                this.className = 'badge bg-warning';
            } else if (this.textContent === 'Away') {
                this.textContent = 'Offline';
                this.className = 'badge bg-secondary';
            } else {
                this.textContent = 'Online';
                this.className = 'badge bg-success';
            }
        });
    }
    
    // Refresh users list
    const refreshUsersBtn = document.getElementById('refreshUsers');
    if (refreshUsersBtn) {
        refreshUsersBtn.addEventListener('click', function() {
            // Simulate refreshing user list
            const usersList = document.getElementById('onlineUsers');
            if (usersList) {
                // Show loading state
                this.textContent = 'Menyegarkan...';
                this.disabled = true;
                
                setTimeout(() => {
                    // Add a random user
                    const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
                    
                    const newUserItem = document.createElement('li');
                    newUserItem.className = 'list-group-item d-flex align-items-center';
                    newUserItem.innerHTML = `
                        <span class="online-indicator"></span>
                        ${randomUser}
                    `;
                    
                    usersList.appendChild(newUserItem);
                    
                    // Reset button
                    this.textContent = 'Refresh Pengguna';
                    this.disabled = false;
                    
                    // Show success message in chat
                    addChatMessage('Daftar pengguna berhasil diperbarui!', false, 'Admin', true);
                }, 1000);
            }
        });
    }
});

// Function to handle file uploads (simulation)
function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput && fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        addChatMessage(`Mengunggah file: ${fileName}...`, true);
        
        // Simulate upload progress
        setTimeout(() => {
            addChatMessage(`File ${fileName} berhasil diunggah!`, false, 'Admin', true);
        }, 1500);
        
        // Reset file input
        fileInput.value = '';
    }
}