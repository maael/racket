const spawn = require('child_process').spawn
const path = require('path')

module.exports = function setAudioDevices (device) {
  return new Promise((resolve, reject) => {
    const nircmdc = spawn(path.join(__dirname, '..', 'tools', 'nircmdc.exe'), ['setdefaultsounddevice', device.name])
    nircmdc.stdout.on('data', (data) => reject(new Error('Unexpected output')))
    nircmdc.stderr.on('data', (data) => reject(data))
    nircmdc.on('close', (code) =>  resolve(code))
  })
}
