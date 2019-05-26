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

function parse (data) {
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
  parse
}
