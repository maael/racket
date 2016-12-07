const AutoLaunch = require('auto-launch')

module.exports = function toggleAutoLaunch () {
  let appAutoLauncher = new AutoLaunch({ name: 'Racket' })
  appAutoLauncher.toggle = toggleAutoLaunch
  return appAutoLauncher
}

function toggleAutoLaunch (menuItem) {
  appAutoLauncher.isEnabled()
    .then((isEnabled) => {
      const action = isEnabled ? 'disable' : 'enable'
      appAutoLauncher[action]()
        .then(() => {
          menuItem.checked = !isEnabled
        })
    })
}
