// Make sure we load from module config folder
const path = require('path')
process.env.NODE_CONFIG_DIR = path.join(__dirname, './config')
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y'

// Export module
const MyHabeetat = require('./lib/MyHabeetat.js')
module.exports = MyHabeetat
