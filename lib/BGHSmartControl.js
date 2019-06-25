const config = require('../config/default.js')
const axios = require('axios')

const MODES = [
  { name: 'OFF', code: 0 },
  { name: 'COOL', code: 1 },
  { name: 'HEAT', code: 2 },
  { name: 'DRY', code: 3 },
  { name: 'FAN', code: 4 },
  { name: 'AUTO', code: 254 },
  { name: 'NO_CHANGE', code: 255 }
]
const FAN_MODES = [
  { name: 'SLOW', code: 1 },
  { name: 'MID', code: 2 },
  { name: 'HIGH', code: 3 },
  { name: 'AUTO', code: 254 },
  { name: 'NO_CHANGE', code: 255 }

]
const CODES = { TEMPERATURE: 13, TARGET_TEMPERATURE: 20, FAN_MODE: 15, MODE: 14 }

async function setStatus (token, endpoint, status) {
  let mode = MODES.find(m => m.name === status.mode)
  let fanMode = FAN_MODES.find(m => m.name === status.fanMode)
  let { data } = await axios.post(config.urls.HVACSetModes, {
    token: { Token: token },
    flags: 255,
    endpointID: endpoint,
    mode: mode ? mode.code : undefined,
    fanMode: fanMode ? fanMode.code : undefined,
    desiredTempC: status.targetTemperature || -327.68 // Random? Web panel uses that number for some reason for target
  })
  // Return true if command applied successfully, false if not
  return (data.HVACSetModesResult && data.HVACSetModesResult.ResponseStatus && data.HVACSetModesResult.ResponseStatus.Status === 0) || false
}

async function turnOn (token, endpoint) {
  let success = await setStatus(token, endpoint, {
    mode: 'AUTO'
  })
  return success
}

async function turnOff (token, endpoint) {
  let success = await setStatus(token, endpoint, {
    mode: 'OFF'
  })
  return success
}

function parseStatus (data) {
  let temperature, targetTemperature, fanMode, mode
  try {
    // Current temperature
    temperature = parseFloat(data.find(v => v.ValueType === CODES.TEMPERATURE).Value)

    // Target temperature
    targetTemperature = parseFloat(data.find(v => v.ValueType === CODES.TARGET_TEMPERATURE).Value)

    // Fan mode
    let fanCode = parseInt(data.find(v => v.ValueType === CODES.FAN_MODE).Value)
    fanMode = FAN_MODES.find(m => m.code === fanCode).name

    // Unit mode
    let modeCode = parseInt(data.find(v => v.ValueType === CODES.MODE).Value)
    mode = MODES.find(m => m.code === modeCode).name
  } catch (error) {
    throw new Error('Error parsing packet for device.')
  }

  return {
    mode,
    fanMode,
    temperature,
    targetTemperature
  }
}

module.exports = {
  parseStatus,
  setStatus,
  turnOn,
  turnOff
}
