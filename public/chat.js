
//chat stuff

const socket = io();

let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');
let queryParamValue = input.getAttribute('name'); //channel_id from queryparams used in Url by taken from name attribute in input

//on submitting the form in html
form.addEventListener('submit', e => {
    //we don't want to post the form which is the default behavior
    e.preventDefault();

    //the message from user is sent to server as a 'chat message'
    if(input.value) {
        
        socket.emit('chat message', {inputValue: input.value, channelId: queryParamValue});
        input.value = ''; //empties input field from previous chat messages
    }
});

//capture a 'chat message' event from server and include it to the page
socket.on('chat message', (message) => {

    let item = document.createElement('li');
    item.textContent = message; 
    messages.appendChild(item);
})

