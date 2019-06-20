/* eslint-disable no-unused-expressions */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const BGHSmartControl = require('../lib/BGHSmartControl.js')

let goodEndpoint = [
  { Value: '24.3', ValueType: 13 },
  { Value: '2', ValueType: 14 },
  { Value: '3', ValueType: 15 },
  { Value: '0', ValueType: 16 },
  { Value: '0', ValueType: 17 },
  { Value: '0', ValueType: 18 },
  { Value: '26', ValueType: 20 },
  { Value: '77', ValueType: 59 },
  { Value: '4170', ValueType: 60 },
  { Value: '86', ValueType: 61 },
  { Value: '0', ValueType: 62 }
]
let badEndpoint = []
let goodEndpointResults = {
  mode: 'HEAT',
  fanMode: 'HIGH',
  temperature: 24.3,
  targetTemperature: 26
}

describe('#BGHSmartControl.parse()', function () {
  context('with good endpoint values', function () {
    let data
    before(function () {
      data = BGHSmartControl.parseStatus(goodEndpoint)
    })
    it('should return the parsed data object', function () {
      expect(data).to.be.an('object')
    })
    it('parsed object should have all BGH status variables', function () {
      expect(data).to.have.keys(['mode', 'fanMode', 'temperature', 'targetTemperature'])
    })
    it('BGH status variables should match their expected value', function () {
      expect(data.mode).to.equal(goodEndpointResults.mode)
      expect(data.fanMode).to.equal(goodEndpointResults.fanMode)
      expect(data.temperature).to.equal(goodEndpointResults.temperature)
      expect(data.targetTemperature).to.equal(goodEndpointResults.targetTemperature)
    })
  })
  context('with bad endpoint values', function () {
    it('should fail and throw a known error', function () {
      expect(() => { BGHSmartControl.parseStatus(badEndpoint) }).to.throw(Error, 'Error parsing packet for device.')
    })
  })
})
