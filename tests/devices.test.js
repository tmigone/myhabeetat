/* eslint-disable no-unused-expressions */
require('dotenv').config()
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const expect = chai.expect
const MyHabeetat = require('../lib/MyHabeetat.js')

let validCredentials = { email: process.env.USER_VALID, password: process.env.PASSWORD_VALID }

describe('#MyHabeetat.getDevices()', function () {
  this.timeout(5000) // Solidmation's API is really slow
  context('with valid token and valid homeID', function () {
    let token = ''
    let home = 0
    before(async () => {
      token = await MyHabeetat.login(validCredentials.email, validCredentials.password)
      home = (await MyHabeetat.getHomes(token))[ 0 ]
    })
    it('should return an array of device objects', async () => {
      let devices = await MyHabeetat.getDevices(token, home)
      expect(devices).to.be.an('array')
    })
  })
})
