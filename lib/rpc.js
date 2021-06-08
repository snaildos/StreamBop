const RPC = require("discord-rpc");
const rpc = new RPC.Client({
    transport: "ipc"
});
console.log("RPC loading...");
rpc.on("ready", () => {
    rpc.setActivity({
        details: "Using StreamBop!",
        state: "Streaming and using StreamBop!",
        startTimestamp: new Date(),
        largeImageKey: "logo",
        largeImageText: "streambop.snaildos.com",
        smallImageText: "Check out StreamBop today!"
    });

    console.log("RPC loaded.");
});

rpc.login({
    clientId: "574097225337012225"
});