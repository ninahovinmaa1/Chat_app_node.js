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

