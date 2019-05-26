/* eslint-disable no-unused-expressions */
require('dotenv').config()
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const expect = chai.expect
const MyHabeetat = require('../lib/MyHabeetat.js')

let invalidCredentials = { email: 'fake@email.com', password: '123456' }
let validCredentials = { email: process.env.USER_VALID, password: process.env.PASSWORD_VALID }

describe('#MyHabeetat.login()', function () {
  context('with valid credentials', function () {
    it('should return a valid token', async () => {
      let token = await MyHabeetat.login(validCredentials.email, validCredentials.password)
      expect(token).to.be.a('string').that.is.not.empty
    })
  })
  context('with invalid credentials', function () {
    it('should reject login attempt', async () => {
      await expect(MyHabeetat.login(invalidCredentials.email, invalidCredentials.password)).to.be.rejectedWith(Error, 'Provided credentials are not valid')
    })
  })
})
