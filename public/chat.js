//ChannelList functionality, FE for posting a new channel that interacts w/ endpoint
const addChannelBtn = document.getElementById("add_channel");

function addNewChannel() {

    // ask userinput. Input value is set into let channelName. 
    let channelName = prompt("Enter channelName: ", "channel123");
    let channelNameObj = {channelName: channelName};  //json stuff, expected value {"channelName":"awesome channelname"}

    if (channelName != null) {
        //post channelName to BE/DB
        fetch("/channels/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(channelNameObj)
        })
            .then(response => response.json())
            .then(data => {
                window.location.href = "/channels/channelList" //reload page to update channelList
                })
    }
}

addChannelBtn.addEventListener("click", (e) => {
    
    addNewChannel();
})

//chat stuff

//const chatArea = document.getElementById('chat-content')


const socket = io();

let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');

form.addEventListener('submit', e => {
    //we don't want to post the form which is the default behavior
    e.preventDefault();

    if(input.value) {
        socket.emit('chat message', input.value);
        input.value = ''; //empties input field from previous chat messages
    }
});

socket.on('chat message', message => {
    console.log(message)
    let item = document.createElement('li');
    item.textContent = message; 
    messages.appendChild(item);
})
