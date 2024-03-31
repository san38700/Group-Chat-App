const chatInput = document.getElementById('chat-input');
var sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const onlineUsers = document.getElementById('online-users')
var userName = JSON.parse(localStorage.getItem('user'))
const createGroupButton = document.getElementById('show-group-form')
const submitGroupForm = document.getElementById('group-form')
const submitGroupButton = document.getElementById('create-group')
const groupHeader = document.getElementById('group-header')
const createName = document.getElementById('group-name')
const userEmail = document.getElementById('useremail') 
const chatHeader = document.getElementById('active-chat')
const addUserInput = document.getElementById('add-user-div')
const userSearchButton = document.getElementById('user-search')
const groupUsers = document.getElementById('group-users')

let emails = []
//console.log(createName)

document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('jwtToken')
    //console.log(userName)

    //sendBtn.addEventListener('click', sendMessage);
    createGroupButton.addEventListener('click', hideCreateGroupButton)
    userSearchButton.addEventListener('click', searchUsers)
    submitGroupForm.addEventListener('submit', createNewGroup)
    

    function hideCreateGroupButton(e){
        e.preventDefault()
        createGroupButton.style.display = 'none'
        submitGroupForm.style.display = 'block'
       

    }

    async function createNewGroup(e){
        e.preventDefault()
        const groupName = createName.value
        //const emails = userEmail.value
        var emailArray = emails
        console.log(groupName)
        try{
            const response = await axios.post('http://localhost:3000/user/newgroup', {groupName, emailArray}, {headers :{"Authorization": token }})
            console.log(response)
        }catch(err){
            console.log(err)
        }
        createGroupButton.style.display = 'block'
        submitGroupForm.style.display = 'none'
        alert('Group Created Successfully')
        fetchGroups(groupName)
    }

    async function addUsers(groupName,groupId){
        //e.preventDefault()
        
        const emailInput = document.getElementById('add-user-email')
        emailInput.placeholder = `${groupName} - Add Users `
        addUserInput.style.display = 'block'
        const postUserButton = document.getElementById('submit-user')
        postUserButton.addEventListener('click', () => {
            const email = emailInput.value
            console.log(email)
            postUser(groupId, groupName, email)
        })
        

    }

    async function postUser(groupId, groupName, email){
        try{
            const response = await axios.post('http://localhost:3000/user/adduser-to-group', {groupId, groupName, email})
            console.log(response)
            fetchGroupUsers(groupId)
        }catch(err){
            console.log(err)
            alert(`${err.response.data.message}`)
        }
    }

    async function searchUsers(e){
        e.preventDefault()
        const email = userEmail.value
        try{
            const users = await axios.post('http://localhost:3000/user/search-user',{email})
            console.log(users)
            const displayuserDiv = document.getElementById('list-users')
            const userDiv = document.createElement('div')
            const addUserToListButton = document.createElement('button')
            addUserToListButton.innerText = "Add"
            addUserToListButton.classList = "btn btn-light"
            addUserToListButton.type = 'button'
            addUserToListButton.addEventListener('click', () => {
                addUserToList(users.data.email)
                addUserToListButton.innerText = 'Added'
                addUserToListButton.disabled = true;
            })
            userDiv.innerHTML = `<p>Name:${users.data.name} Email:${users.data.email}</p>`
            userDiv.append(addUserToListButton)
            //console.log(userDiv)
            displayuserDiv.appendChild(userDiv)
            email.value = ""
        }catch(err){
            console.log(err)
            const displayuserDiv = document.getElementById('list-users')
            const userDiv = document.createElement('div')
            userDiv.innerText = `${err.response.data.message}`
            //console.log(userDiv)
            displayuserDiv.appendChild(userDiv)
        }
    }

    function addUserToList(email){
        if(!emails.includes(email)){
            emails.push(email)
            console.log(emails)
        }else{
            alert('User already added')
        }
        
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
            chatMessages.innerHTML = `<div><button id="load-messages" class="btn btn-secondary btn-sm">Load Older messages</button></div>`
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
                        if (chat.user.name == userName.userName){
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
            button.classList = "btn btn-secondary btn-sm"
            button.textContent = 'Newer Messages';
            button.addEventListener('click',() => {
                fetchAndDisplayChats(groupId)
            })
            newButton.appendChild(button)
            chatMessages.appendChild(newButton)
        }
    }

    async function fetchGroupUsers(groupId){
        const response = await axios.get(`http://localhost:3000/group/getgroupsusers?groupid=${groupId}`);
        console.log(response.data.groupusers)
        const Users = response.data.groupusers
        groupUsers.innerHTML = ""
        //const username = JSON.parse(localStorage.getItem('user'))
        //console.log(userName.userName)
        //console.log('user>>>',username)
        const jwtToken = localStorage.getItem('jwtToken')
        const isAdmin = await checkAdminStatus(groupId, jwtToken)
        console.log('isadmin',isAdmin)
        Users.forEach(user => {
            const userDiv = document.createElement('div')
            const adminButton = document.createElement('button')
            adminButton.classList = "btn btn-outline-secondary"
            adminButton.innerText = "Make Admin"
            const removeUserbutton = document.createElement('button')
            removeUserbutton.classList = "btn btn-outline-success"
            removeUserbutton.innerText = "Remove User"
            if (user.role == 'member' && isAdmin){
                adminButton.addEventListener('click', () => {
                    console.log('userId>>>>',user.userId)
                    makeAdmin(user.userId, user.groupId)
                })
            }
            
            removeUserbutton.addEventListener('click', () => {
                removeUser(user.userId, user.groupId)
            })
            if(userName.userName == user.username){
                userDiv.innerText =`${user.username} (You) - ${user.role}`
            }else{
                userDiv.innerText =`${user.username} - ${user.role}`
            }
            if(user.role == 'member' && isAdmin){
                userDiv.appendChild(adminButton)
                userDiv.appendChild(removeUserbutton)
            }
            
            
            groupUsers.appendChild(userDiv)
            console.log(user.username)
        })
    }

    async function checkAdminStatus(groupId, token) {
        const response = await axios.get(`http://localhost:3000/group/checkadminstatus?groupid=${groupId}`,{headers: {'Authorization': token }});
        //return response.data
        console.log(response.data.isadmin)
        //console.log(typeof(response.data.isadmin))
        return response.data.isadmin
    }

    async function makeAdmin(userId,groupId){
        const response = await axios.post(`http://localhost:3000/group/addadmin`,{userId,groupId});
        console.log(response.data)
        fetchGroupUsers(groupId)
    }

    async function removeUser(userId,groupId){
        const response = await axios.post(`http://localhost:3000/group/removeuser`,{userId,groupId});
        console.log(response.data)
        fetchGroupUsers(groupId)
    }

    async function fetchGroups(){
        
        const response = await axios.get(`http://localhost:3000/group/getgroups`,{headers: {'Authorization': token }});
        console.log(response.data)
        const groups = response.data.group
        groupHeader.innerHTML = ""
        const buttonDiv = document.createElement('div')
        
        groups.forEach(group => {
           
            const groupDiv = document.createElement('div')
            //const buttonDiv = document.createElement('div')
            const link = document.createElement("a");
            link.href = '#'
            link.textContent = `${group.groupname}`
            link.addEventListener("click", ()=> {
                console.log('clicked')
                chatHeader.innerText = group.groupname
                fetchAndDisplayChats(group.id)
                fetchGroupUsers(group.id)
                sendBtn.addEventListener('click', () => {
                    sendMessage(group.id);
                });
                buttonDiv.innerHTML = ""
                addUserInput.style.display = 'none'
                const addUserButton = document.createElement('button')
                addUserButton.classList = "btn btn-primary"
                addUserButton.innerText = "Add Users to Group"
                const jwtToken = localStorage.getItem('jwtToken')
                checkAdminStatus(group.id, jwtToken)
                .then(isAdmin => {
                    console.log('boolean',isAdmin)
                    if (isAdmin) {
                        addUserButton.addEventListener('click', () => {
                        addUsers(group.groupname, group.id);
                        });
                        buttonDiv.appendChild(addUserButton);
                    }
                })
                .catch(error => {
                    console.error('Error checking admin status:', error);
                });
                groupDiv.appendChild(buttonDiv)
                
                
            
            });
            groupDiv.innerHTML = ""
            groupDiv.appendChild(link)
            groupHeader.appendChild(groupDiv)
        })
        
    }
        
})

