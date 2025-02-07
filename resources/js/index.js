const nameInput = document.getElementById("my-name-input");
const messageInput = document.getElementById("my-message-input");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

const serverURL = `https://it3049c-chat.fly.dev/messages`;

function formatMessage(message, senderName) {
  const time = new Date(message.timestamp);
  const min = ('0' + time.getMinutes()).slice(-2);
  const formattedTime = `${time.getHours()}:${min}`;

  if (senderName === message.sender) {
    return `
      <div class="mine messages">
        <div class="message">
          ${message.text}
        </div>
        <div class="sender-info">
          ${formattedTime}
        </div>
      </div>
    `;
  } else {
    return `
      <div class="yours messages">
        <div class="message">
          ${message.text}
        </div>
        <div class="sender-info">
          ${message.sender} ${formattedTime}
        </div>
      </div>
    `;
  }
}

function fetchMessages() {
  return fetch(serverURL)
    .then(response => response.json());
}

async function updateMessagesInChatBox()
{
  // Fetch Messages
  const messArr = await fetchMessages();
  let formattedMes = "";
  // Loop over the messages
  for (let i of messArr)
  {
    // Format them
    formattedMes += formatMessage(i,nameInput.value);
  }
  // Add them to the chatbox using DOM manipulation
  chatBox.innerHTML = formattedMes;
  chatBox.scrollTop = chatBox.scrollHeight;
}


function sendMessages(name,message)
{
  const newMessage =
  {
    sender: name,
    text: message,
    timestamp: new Date()
  };

  fetch(serverURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newMessage)
  })
  updateMessagesInChatBox();
}

sendButton.addEventListener(`click`, function (e) 
{
  e.preventDefault();
  const name = nameInput.value;
  const message = messageInput.value;
  sendMessages(name,message);
  //Clear message text field
  messageInput.value = "";
})

document.addEventListener(`DOMContentLoaded`, function ()
{
  updateMessagesInChatBox();
})
setInterval(updateMessagesInChatBox, 10000);
