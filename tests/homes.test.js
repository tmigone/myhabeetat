/* eslint-disable no-unused-expressions */
require('dotenv').config()
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const expect = chai.expect
const MyHabeetat = require('../lib/MyHabeetat.js')

let validCredentials = { email: process.env.USER_VALID, password: process.env.PASSWORD_VALID }
let invalidToken = 'definitely-not-a-valid-token'

describe('#MyHabeetat.getHomes()', function () {
  this.timeout(5000) // Solidmation's API is really slow
  context('with valid token and existing homes', function () {
    let token = ''
    before(async () => {
      token = await MyHabeetat.login(validCredentials.email, validCredentials.password)
    })
    it('should return an array with the home ids', async () => {
      let homes = await MyHabeetat.getHomes(token)
      expect(homes).to.be.an('array')
    })
  })
  context('with invalid token', function () {
    it('should fail and throw a known error', async () => {
      await expect(MyHabeetat.getHomes(invalidToken)).to.be.rejectedWith(Error, 'Provided token is not valid.')
    })
  })
})
