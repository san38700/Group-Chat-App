const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const onlineUsers = document.getElementById('online-users')

var userName = localStorage.getItem('user')
const token = localStorage.getItem('jwtToken')
//console.log(userName)

const onlineDiv = document.createElement('div')
onlineDiv.classList.add('online')
onlineDiv.innerHTML = `<p> online users: ${userName}`
onlineUsers.appendChild(onlineDiv)

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    const messageText = chatInput.value
    //console.log(messageText)
    try{
        const response = await axios.post('http://localhost:3000/user/chats', {messageText}, {headers :{"Authorization": token }})
        //console.log(response.data.chats.message)
        const text = response.data.chats.message

    if (messageText !== '') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sender');
        messageDiv.innerHTML = `<p> You: ${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }
    }catch(err){
        console.log(err)
    }
    
}
