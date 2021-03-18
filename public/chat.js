const addChannelBtn = document.getElementById("add_channel");

function promptNewChannelName() {

    let channelName = prompt("Enter channelName: ", "channel123");
    let channelNameObj = {channelName: channelName};

    if (channelName != null) {
        //post to BE/DB
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
    
    promptNewChannelName();
})


