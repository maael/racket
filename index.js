const { app, Tray, Menu, MenuItem, BrowserWindow } = require('electron')
const path = require('path')
const getAudioDevices = require('./lib/get-audio-devices')
const setAudioDevice = require('./lib/set-audio-device')
const iconPath = path.join(__dirname, 'media', 'icon.png')

let appIcon = null
let win = null
let autoLaunchControl = require('./lib/control-auto-launch')()

app.on('ready', () => {
  win = new BrowserWindow({ show: false })
  appIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    { type: 'separator' },
    { type: 'checkbox',
      label: 'Start on boot',
      checked: false,
      click: autoLaunchControl.toggle
    },
    { label: 'Quit', role: 'quit'}
  ])

  autoLaunchControl.isEnabled()
    .then((isEnabled) => {
      contextMenu.items[contextMenu.length - 2].checked = true
    })

  getAudioDevices().then((devices) => {
    devices.forEach((device) => { addMenuItem(contextMenu, device) })
  })

  appIcon.setToolTip('Racket 🎶')
  appIcon.setContextMenu(contextMenu)
})

function addMenuItem (contextMenu, device) {
  const menuItem = new MenuItem({
    label: device.full,
    type: 'checkbox',
    checked: false,
    click: callSetAudioDevice.bind(null, contextMenu, device)
  })
  contextMenu.insert(0, menuItem)
}

function callSetAudioDevice (contextMenu, device, menuItem) {
  setAudioDevice(device)
    .then(() => {
      contextMenu.items.slice(0, -3).forEach((item, index) => {
        contextMenu.items[index].checked = false
      })
      menuItem.checked = true
    })
}
