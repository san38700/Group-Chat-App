const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const onlineUsers = document.getElementById('online-users')
var userName = localStorage.getItem('user')

document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('jwtToken')
    //console.log(userName)

    sendBtn.addEventListener('click', sendMessage);

    async function sendMessage() {
        const messageText = chatInput.value
        //console.log(messageText)
        try{
            const response = await axios.post('http://localhost:3000/user/chat', {messageText}, {headers :{"Authorization": token }})
            //console.log(response.data.chats.message)
            fetchAndDisplayChats()
        }catch(err){
            console.log(err)
        }
        
    }
    fetchAndDisplayChats()

    async function fetchAndDisplayChats(){
        const token = localStorage.getItem('jwtToken')
        //console.log(token)
        try{
            const response = await axios.get(`http://localhost:3000/user/chats`,{headers: {'Authorization': token }});
            //console.log(response.data.chats[0].user.name)
            const chats = response.data.chats
            
            chatMessages.innerText = ""

            if (chats.length !== 0) {
                chats.forEach(chat => {
                    //console.log(chat.message)
                    if (chat.message != ""){
                        const messageDiv = document.createElement('div');
                        messageDiv.classList.add('message', 'sender');
                        //console.log(chat.user.name)
                        if (chat.user.name == userName){
                            messageDiv.innerHTML = `<p> You: ${chat.message}</p>`;
                        }else{

                            // Change the background color
                            messageDiv.style.backgroundColor = '#ff0000';
                            messageDiv.innerHTML = `<p> ${chat.user.name}: ${chat.message}</p>`;
                        }
                
                    chatMessages.appendChild(messageDiv);
                    chatInput.value = '';
                    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
                    }
                });
            
                }
        }catch(err){
            console.log(err)
        }
    }
        
})

