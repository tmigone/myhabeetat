const config = require('../config/default.js')
const axios = require('axios')
const BGHSmartControl = require('./BGHSmartControl.js')

// Supported device models
const DEVICE_MODELS = {
  BGH_SMART_CONTROL: 15
}

async function login (email, password) {
  let { data } = await axios.post(config.urls.login, { AccountEmail: email, Password: password })

  // Wrong user/pass
  if (data.AccessToken === '') {
    throw new Error('Provided credentials are not valid.')
  }

  return data.AccessToken
}

async function getHomes (token) {
  let { data } = await axios.post(config.urls.enumHomes, { token: { Token: token } })
  let { Homes, ResponseStatus } = data.EnumHomesResult

  // Status = 2 appears to be for generic errors
  if (ResponseStatus.Status === 2) {
    throw new Error('Provided token is not valid.')
  }

  // Homes is null if there are none registered
  return Homes ? Homes.map(h => h.HomeID) : []
}

async function getDataPacket (token, home) {
  let { data } = await axios.post(config.urls.getDataPacket, {
    homeID: home,
    token: { Token: token },
    timeOut: 10000,
    serials: { Home: 0, Groups: 0, Devices: 0, Endpoints: 0, EndpointValues: 0, Scenes: 0, Macros: 0, Alarms: 0 }
  })

  // Status = 2 appears to be for generic errors
  if (data.GetDataPacketResult.ResponseStatus.Status === 2) {
    throw new Error('Provided token or home ID not valid.')
  }

  return data.GetDataPacketResult
}

async function getDevices (token, home) {
  let packet = await getDataPacket(token, home)

  // Devices is null if there are none registered
  return packet.Devices ? packet.Devices.map(d => ({
    id: d.DeviceID,
    home: d.HomeID,
    model: d.DeviceModelID,
    name: d.Description,
    endpoint: packet.Endpoints.find(e => e.DeviceID === d.DeviceID).EndpointID
  })) : []
}

async function getDeviceStatus (token, home, device) {
  let _device, endpoint, data
  let packet = await getDataPacket(token, home)

  // Get device info
  try {
    _device = packet.Devices.find(d => d.DeviceID === device)
  } catch (error) {
    throw new Error('Provided device ID is invalid.')
  }

  // Get device data
  try {
    let endpointID = packet.Endpoints.find(e => e.DeviceID === device).EndpointID
    endpoint = packet.EndpointValues.find(e => e.EndpointID === endpointID)
  } catch (error) {
    throw new Error('Error getting device data.')
  }

  switch (_device.DeviceModelID) {
    case DEVICE_MODELS.BGH_SMART_CONTROL:
      data = BGHSmartControl.parseStatus(endpoint.Values)
      break
    default:
      throw new Error('Device not supported.')
  }

  return data
}

async function setDeviceStatus (token, model, endpoint, status) {
  let success
  switch (model) {
    case DEVICE_MODELS.BGH_SMART_CONTROL:
      success = await BGHSmartControl.setStatus(token, endpoint, status)
      break
    default:
      throw new Error('Device not supported.')
  }

  return success
}

async function turnOnDevice (token, model, endpoint) {
  let success
  switch (model) {
    case DEVICE_MODELS.BGH_SMART_CONTROL:
      success = await BGHSmartControl.turnOn(token, endpoint)
      break
    default:
      throw new Error('Device not supported.')
  }

  return success
}

async function turnOffDevice (token, model, endpoint) {
  let success
  switch (model) {
    case DEVICE_MODELS.BGH_SMART_CONTROL:
      success = await BGHSmartControl.turnOff(token, endpoint)
      break
    default:
      throw new Error('Device not supported.')
  }

  return success
}

module.exports = {
  login,
  getHomes,
  getDevices,
  getDataPacket,
  getDeviceStatus,
  setDeviceStatus,
  turnOnDevice,
  turnOffDevice
}
