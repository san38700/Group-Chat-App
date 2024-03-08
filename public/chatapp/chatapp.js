const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const onlineUsers = document.getElementById('online-users')

var userName = localStorage.getItem('user')
console.log(userName)

const onlineDiv = document.createElement('div')
onlineDiv.classList.add('online')
onlineDiv.innerHTML = `<p> online users: ${userName}`
onlineUsers.appendChild(onlineDiv)

sendBtn.addEventListener('click', sendMessage);

function sendMessage() {
    const messageText = chatInput.value
    console.log(messageText)

    if (messageText !== '') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sender');
        messageDiv.innerHTML = `<p> You:${messageText}</p>`;
        chatMessages.appendChild(messageDiv);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }
}
