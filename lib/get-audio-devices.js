const spawn = require('child_process').spawn
const path = require('path')

module.exports = function getAudioDevices () {
  return new Promise((resolve, reject) => {
    const devcon = spawn(path.join(__dirname, '..', 'tools', 'devcon.exe'), ['find', '@SWD\\MMDEVAPI\\{0.0.0.00000000}*'])
    let devices = []
    devcon.stdout.on('data', (data) => {
      devices = data
    		.toString()
    		.split('\n')
    		.filter(filterSoftwareDevices)
    		.map(mapDetails)
    })

    devcon.stderr.on('data', (data) => reject(data))
    devcon.on('close', (code) =>  resolve(devices))
  })
}

function filterSoftwareDevices (device) {
	return device.startsWith('SWD')
}

function mapDetails (device) {
	const details = device.match(/:\ (.*)/)[1].trim()
	return ({
		name: details.match(/(.*)\ \(/)[1].trim(),
		details: details.match(/\((.*)\)/)[1].trim(),
		full: details
	})
}
