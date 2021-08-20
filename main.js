const { autoUpdater } = require('electron-updater');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const { app, BrowserWindow, ipcMain } = require('electron');
const { trackEvent } = require('./lib/analytics.js');
const { watchFile } = require('fs');
// is dev
  var isDev = require('isdev')
// Notify
const { Notification } = require('electron')

const Store = require('electron-store');

const config = new Store();

function die() {
mainWindow.removeAllListeners('closed');
strm.removeAllListeners('closed');
strm.close()
app.quit()
}

function strmex() {
app.removeAllListeners('window-all-closed');
mainWindow.removeAllListeners('closed');
mainWindow.close()
app.quit()
}

function neterr() {
  const notification = {
    title: 'SnailPortal',
    body: 'No valid network connection! Please reconnect!'
  }
  new Notification(notification).show()
}

// wait function
function wait(ms)
{
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while(d2-d < ms);
}

// Start the libaries
require('./lib/rpc.js');
console.log("RPC lib init.");


// Loading screen
/// create a global var, wich will keep a reference to out loadingScreen window
let loadingScreen;
const createLoadingScreen = () => {
  loadingScreen = new BrowserWindow(
    Object.assign({
      width: 800,
      height: 800,
      alwaysOnTop: true,
      frame: false,
      fullscreen: false,
      show: false
    })
  );
  loadingScreen.setResizable(false);
  loadingScreen.loadFile('splash.html');
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
};
console.log("Loading screen ready.");

// Start the main program
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    fullscreen: false,
    modal: true,
    icon: 'snailfm.ico',
    webPreferences: {
      nodeIntegration: true,
      devTools: isDev,
      contextIsolation: false
    },
  });
  console.log("More configuration is being sent now.")
  console.log("We are going to send a google analytics streambop.started event")
  trackEvent('streambop.started', 'StreamBop sucessfully started!');
  console.log("We just sent the event. Now let's continue loading")
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setResizable(false)
  mainWindow.loadFile('index.html');
  mainWindow.on('maximize', () => mainWindow.unmaximize());
  wait(4000)
  console.log("Loaded sucess.")
  loadingScreen.close();

mainWindow.on('closed', () => (
die()
));

if(isDev) {
  console.log("In Development!")
} else {
  console.log("Not in Development!")
}

    var internetAvailable = require("internet-available");

// Set a timeout and a limit of attempts to check for connection
internetAvailable({
    timeout: 2000,
    retries: 3,
}).then(function(){
    console.log("Internet available");
}).catch(function(){
    console.log("No internet");
    neterr()
    mainWindow.loadFile('nonet.html');
});
    mainWindow.show();
    console.log("Ok! Window init, let's check for updates...")
    autoUpdater.checkForUpdatesAndNotify();
    console.log("Update checked. Let's see what happens!");
  };

console.log("Main screen ready.");

// strm
/// create a global var, wich will keep a reference to out loadingScreen window
let strm;

const createNewstrm = () => {
  strm = new BrowserWindow(
    Object.assign({
      width: 800,
      setResizable: false,
      isClosable: false,
      minimizable: false,
      height: 600,
      backgroundThrottling: false,
      alwaysOnTop: false,
      frame: true,
      fullscreen: false,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        devTools: isDev,
        contextIsolation: false
      },
    })
  );
  strm.setResizable(false);
  strm.loadFile('strm.html');
  strm.isMovable(false)
  strm.setMenuBarVisibility(false)
  strm.on('closed', () => (strmex()));
};


app.on('ready', () => {
console.log("strm red");
config.set("on", false);
createNewstrm();
})


app.on('ready', () => {
  createLoadingScreen();
  console.log("Send check for updates signal...");
  console.log("Alright, lets go!");
  setTimeout(() => {
    console.log("Main WIN.REQ has been sent now.")
    createWindow();
  }, 3000);
})


app.on('window-all-closed', function () {
  die()
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('relaunch', () => {
  mainWindow.close()
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('strm', () => {
  strm.show()
});

ipcMain.on('strm.hide', () => {
  strm.hide()
});

ipcMain.on('strm.start', () => {
  console.log("on")
  config.set("on", true);
});

ipcMain.on('strm.stop', () => {
  console.log("off")
  config.set("on", false);
});

ipcMain.on('strm.setup', () => {
  console.log("redr")
  config.set("on", false);
  config.set("setupan", true);
});

ipcMain.on('strm.reload', () => {
  strm.reload();
});

