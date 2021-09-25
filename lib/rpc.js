const RPC = require("discord-rpc");
const Store = require('electron-store');
const config = new Store();
config.set("song", "Loading...")
const rpc = new RPC.Client({
    transport: "ipc"
});
console.log("RPC loading...");
rpc.on("ready", () => {
    rpc.setActivity({
        details: "Using StreamBop!",
        state: "Streaming Live on " + config.get("name"),
        startTimestamp: new Date(),
        largeImageKey: "logo",
        largeImageText: "streambop.snaildos.com",
        smallImageText: "Check out StreamBop today!"
    });
    console.log("RPC loaded.");
});

rpc.login({
    clientId: "875774920464928778"
});