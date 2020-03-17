# myhabeetat
Wrapper for MyHabeetat API, control your devices using nodejs.

Supports Solidmation devices, including: 
- BGH Smart Control

## Installation
Install it via NPM:

```bash
npm install --save myhabeetat
```


## Usage

```javascript

const MyHabeetat = require('myhabeetat')

// Get auth token
let token = await MyHabeetat.login('myawesome@email.com', 's3cret_passw0rd')

// Get homes and devices
let homes = await MyHabeetat.getHomes(token)
let devices = await MyHabeetat.getDevices(token, homes[0])

// Turn on device. 15 is model code for BGH Smart Control
let result = await MyHabeetat.turnOnDevice(token, 15, devices[0])
```

## MyHabeetat methods

### MyHabeetat.login(email, password)
#### Arguments
- email (string): Your My Habeetat login email
- password (string): Your My Habeetat login password 

#### Returns
- token (string): Authentication token for My Habeetat's API

### MyHabeetat.getHomes(token)
#### Arguments
- token (string): A valid My Habeetat auth token

#### Returns
- homes (array): An array of home IDs

### MyHabeetat.getDevices(token, home)
#### Arguments
- token (string): A valid My Habeetat auth token
- home (integer): Home ID to get devices from

#### Returns
- devices (array): Array of device objects for the given home

### MyHabeetat.getDeviceStatus(token, home)
#### Arguments
- token (string): A valid My Habeetat auth token
- home (integer): Home ID to get devices from
- device (integer): Device ID to get status from

#### Returns
- status (object): A status object for the given device

### MyHabeetat.setDeviceStatus(token, model, endpoint, status)
#### Arguments
- token (string): A valid My Habeetat auth token
- model (integer): Device model ID. Currently only BGH Smart Control is supported (ID=15)
- endpoint (integer): Endpoint ID for the device. Can be retrieved with `getDeviceStatus` method

#### Returns
- result (boolean): True if the operation succeded.

### MyHabeetat.getDataPacket(token, home)
#### Arguments
- token (string): A valid My Habeetat auth token
- home (integer): Home ID to get devices from

#### Returns
- data (object): Last data packet for the device
