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
            chatInput.value = '';
            fetchAndDisplayChats()
        }catch(err){
            console.log(err)
        }
        
    }
    //setInterval(fetchAndDisplayChats, 1000);
    fetchAndDisplayChats()

    async function fetchAndDisplayChats(){
        const token = localStorage.getItem('jwtToken')
        //console.log(token)
        const chats = []
        const chatsJSON = JSON.stringify(chats);
        localStorage.setItem('chats', chatsJSON);
        const getChatsJSON = localStorage.getItem('chats');
        console.log(getChatsJSON)
        const storedChats = JSON.parse(getChatsJSON);
        console.log(storedChats)
        var lastMessageid
        if (storedChats){
            lastMessageid == 'undefined'
        }else{
            const lastMessage = storedChats[storedChats.length - 1]
            lastMessageid = lastMessage.id
        }
        console.log(lastMessageid)
        
       try{
            const response = await axios.get(`http://localhost:3000/user/chats?lastMessageid=${lastMessageid}`,{headers: {'Authorization': token }});
            console.log(response.data.chats)
            const chats = response.data.chats
            const lastTenChats = chats.slice(-5)
            console.log(lastTenChats)
            const chatsJSON = JSON.stringify(lastTenChats);
            localStorage.setItem('chats', chatsJSON);
            const getChatsJSON = localStorage.getItem('chats');
            //console.log(getChatsJSON)
            const storedChats = JSON.parse(getChatsJSON);
            //console.log(storedChats)
            chatMessages.innerText = ""
            chatMessages.innerHTML = `<div><button id="load-messages">Load Older messages</button></div>`
            const loadMessages = document.getElementById('load-messages')
            loadMessages.addEventListener('click', loadOlderMessages)
            if (storedChats.length !== 0) {
                storedChats.forEach(chat => {
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
                    //chatInput.value = '';
                    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
                    }
                });
            
                }
        }catch(err){
            console.log(err)
        }

        async function loadOlderMessages(){
            const getChatsJSON = localStorage.getItem('chats');
            //console.log(getChatsJSON)
            const storedChats = JSON.parse(getChatsJSON);
            const firstChat = storedChats[0]
            const firstMessageId = firstChat.id
            console.log(firstMessageId)
            const response = await axios.get(`http://localhost:3000/user/chats?lastMessageid=${lastMessageid}&firstMessageId=${firstMessageId}&oldmessage=old`,{headers: {'Authorization': token }});
            const chats = response.data.chats
            const chatsJSON = JSON.stringify(chats);
            localStorage.setItem('chats', chatsJSON);
            const getOldChatsJSON = localStorage.getItem('chats');

            //console.log(getChatsJSON)
            const storedOldChats = JSON.parse(getOldChatsJSON);
            console.log(storedOldChats)
            chatMessages.innerText = ""
            chatMessages.innerHTML = `<div><button id="load-messages">Load Older messages</button></div>`
            const loadMessages = document.getElementById('load-messages')
            loadMessages.addEventListener('click', loadOlderMessages)
            if (storedOldChats.length !== 0) {
                storedOldChats.forEach(chat => {
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
                    //chatInput.value = '';
                    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
                    
                    }
                });
                
                }
                const newButton = document.createElement('div')
                const button = document.createElement('button');
                button.textContent = 'Newer Messages';
                button.addEventListener('click',fetchAndDisplayChats)
                newButton.appendChild(button)
                chatMessages.appendChild(newButton)
        }
    }
        
})

