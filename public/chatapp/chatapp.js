const chatInput = document.getElementById('chat-input');
var sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const onlineUsers = document.getElementById('online-users')
var userName = localStorage.getItem('user')
const createGroupButton = document.getElementById('show-group-form')
const submitGroupForm = document.getElementById('group-form')
const groupHeader = document.getElementById('group-header')
const createName = document.getElementById('group-name')
const userEmail = document.getElementById('useremail') 
const chatHeader = document.getElementById('active-chat')
//console.log(createName)

document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('jwtToken')
    //console.log(userName)

    //sendBtn.addEventListener('click', sendMessage);
    createGroupButton.addEventListener('click', hideCreateGroupButton)
    submitGroupForm.addEventListener('submit', createNewGroup)

    function hideCreateGroupButton(e){
        e.preventDefault()
        createGroupButton.style.display = 'none'
        submitGroupForm.style.display = 'block'

    }

    async function createNewGroup(e){
        e.preventDefault()
        const groupName = createName.value
        const emails = userEmail.value
        var emailArray = emails.split(',')
        console.log(groupName)
        try{
            const response = await axios.post('http://localhost:3000/user/newgroup', {groupName, emailArray}, {headers :{"Authorization": token }})
            console.log(response)
        }catch(err){
            console.log(err)
        }
        fetchGroups(groupName)
    }

    function addUsers(e){
        e.preventDefault()
        const addUserInput = document.getElementById('add-user-div')
        addUserInput.style.display = 'block'
    }

    async function sendMessage(groupId) {
        const messageText = chatInput.value
        console.log(groupId)
        //console.log(messageText)
        try{
            const response = await axios.post('http://localhost:3000/user/chat', {messageText, groupId}, {headers :{"Authorization": token }})
            //console.log(response.data.chats.message)
            chatInput.value = '';
            fetchAndDisplayChats(groupId)
        }catch(err){
            console.log(err)
        }
        
    }
    //setInterval(fetchAndDisplayChats, 1000);
    fetchAndDisplayChats()
    fetchGroups()

    async function fetchAndDisplayChats(groupId){
        const token = localStorage.getItem('jwtToken')
        //console.log(token)
        let chats = localStorage.getItem('chats')
        console.log('chats:',chats)
        //console.log(chats.length)
        var lastMessageid
        if (chats == null){
            //chats = []
           
            }else if(chats.length > 0){
                const lastMessage = chats[chats.length - 1]
                lastMessageid = lastMessage.id
               
            }else{
                lastMessageid == 'undefined'
            }
        console.log('lastmessageid:',lastMessageid)
        
       try{
            const response = await axios.get(`http://localhost:3000/user/chats?lastMessageid=${lastMessageid}&groupid=${groupId}`,{headers: {'Authorization': token }});
            console.log(response.data.chats)
            const chats = response.data.chats
            const lastTenChats = JSON.stringify(chats.slice(-5))
            console.log('lasttenchats:',lastTenChats)
            localStorage.setItem('chats', lastTenChats)
            const storedChats = JSON.parse(localStorage.getItem('chats'))
            console.log('sliced:',storedChats)
            // chatMessages.innerText = ""
            // chatMessages.innerHTML = `<div><button id="load-messages">Load Older messages</button></div>`
            // const loadMessages = document.getElementById('load-messages')
            // loadMessages.addEventListener('click', () => {
            //     loadOlderMessages(groupId)
            // })
            showChatsOnScreen(storedChats,groupId)
           
            
        }catch(err){
            console.log(err)
        }

        function showChatsOnScreen(Chats,groupId){
            chatMessages.innerText = ""
            chatMessages.innerHTML = `<div><button id="load-messages">Load Older messages</button></div>`
            const loadMessages = document.getElementById('load-messages')
            loadMessages.addEventListener('click', () => {
                loadOlderMessages(groupId)
            })
            if (Chats.length !== 0) {
                Chats.forEach(chat => {
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
            }

        async function loadOlderMessages(groupId){
            const getChatsJSON = localStorage.getItem('chats');
            //console.log(getChatsJSON)
            const storedChats = JSON.parse(getChatsJSON);
            const firstChat = storedChats[0]
            console.log(firstChat)
            const firstMessageId = firstChat.id
            console.log(firstMessageId)
            const response = await axios.get(`http://localhost:3000/user/chats?lastMessageid=${lastMessageid}&firstMessageId=${firstMessageId}&groupid=${groupId}`,{headers: {'Authorization': token }});
            const chats = response.data.chats
            const chatsJSON = JSON.stringify(chats);
            localStorage.setItem('chats', chatsJSON);
            const getOldChatsJSON = localStorage.getItem('chats');

            //console.log(getChatsJSON)
            const storedOldChats = JSON.parse(getOldChatsJSON);
            console.log(storedOldChats)
            showChatsOnScreen(storedOldChats)
            
            const newButton = document.createElement('div')
            const button = document.createElement('button');
            button.textContent = 'Newer Messages';
            button.addEventListener('click',() => {
                fetchAndDisplayChats(groupId)
            })
            newButton.appendChild(button)
            chatMessages.appendChild(newButton)
        }
    }

    async function fetchGroups(){
        const response = await axios.get(`http://localhost:3000/group/getgroups`,{headers: {'Authorization': token }});
        console.log(response.data)
        const groups = response.data.group
        groupHeader.innerHTML = ""
        groups.forEach(group => {
           
            const groupDiv = document.createElement('div')
            const link = document.createElement("a");
            link.href = '#'
            link.textContent = `${group.groupname}`
            link.addEventListener("click", ()=> {
                console.log('clicked')
                chatHeader.innerText = group.groupname
                fetchAndDisplayChats(group.id)
                sendBtn.addEventListener('click', () => {
                    sendMessage(group.id);
                });
            
            });
            //link.append(groupNameText)
            const addUserButton = document.createElement('button')
            addUserButton.innerText = "Add Users"
            addUserButton.addEventListener('click', addUsers)
            groupDiv.appendChild(link)
            //groupDiv.appendChild(groupNameText)
            groupDiv.appendChild(addUserButton)
            groupHeader.appendChild(groupDiv)
        })
        
    }
        
})

