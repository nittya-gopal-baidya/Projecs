
      const socket = io();
      let username = '';
      let currentGroup = '';

      function displayMessage(message){
        const messages = document.getElementById("messages");
        const li = document.createElement("li");
        li.textContent = message;
        messages.appendChild(li);
      }

      const messagInput = document.getElementById('messageInput');
    
      function login(){
        const usernameInput = document.getElementById('usernameInput');
        const username = usernameInput.value.trim();
        const namefield = document.getElementById("name");
        if(username){
            document.getElementById('login').style.display = 'none';
            namefield.innerText = username;
            document.getElementById('chat').style.display = 'block';
            document.getElementById('messageInput').style.display = 'block';
            document.getElementById('messageInput').focus();
            document.getElementById('sendMessageBtn').style.display = 'block';
            socket.emit('login',username);
        }
      }



      function joinChatGroup(){
        const groupNameInput = document.getElementById("groupNameInput");
        const groupName = groupNameInput.value.trim();
        if(groupName){
          currentGroup = groupName;
          document.getElementById('groupSelection').style.display = 'none';
          document.getElementById('chatGroup').style.display = 'block';
          document.getElementById('currentGroup').textContent = groupName;
          document.getElementById('messageInput').focus();
          /*The HTMLElement.focus() method sets focus on the specified element, if it can be focused. The focused element is the element that will receive keyboard and similar events by default.
          By default the browser will scroll the element into view after focusing it */
          socket.emit('joinGroup',currentGroup);
        }
      }
      socket.on('loginError',(errorMessage) => {
        alert(errorMessage);
      })

      function sendMessage() {
        const messageInput = document.getElementById("messageInput");
        const message = messageInput.value.trim();
        if (message) {
          socket.emit("chatMessage", message);
          messageInput.value = "";
        }
      }

      socket.on('messageHistory',(history) => {
        const messages = document.getElementById('messages');
        messages.innerHTML = '';

        history.forEach(entry => {
          const message = entry.user === username ? `You : ${entry.message}` : `${entry.user} : ${entry.message}`;
          displayMessage(message);
        });
      })


      socket.on("chatMessage", (message) => {
        displayMessage(message);
      });


    