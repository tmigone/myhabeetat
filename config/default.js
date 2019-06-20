const MYHABEETAT_LOGIN_BASE = 'https://myhabeetat.solidmation.com/accounts/login.aspx'
const MYHABEETAT_CLOUD_BASE = 'https://myhabeetatcloud-services.solidmation.com/1.0/HomeCloudService.svc'
const MYHABEETAT_COMMAND_BASE = 'https://myhabeetatcloud-services.solidmation.com/1.0/HomeCloudCommandService.svc'

module.exports = {
  urls: {
    login: MYHABEETAT_LOGIN_BASE,
    enumHomes: `${MYHABEETAT_CLOUD_BASE}/EnumHomes`,
    getDataPacket: `${MYHABEETAT_CLOUD_BASE}/GetDataPacket`,
    HVACSetModes: `${MYHABEETAT_COMMAND_BASE}/HVACSetModes`,
    HVACSendCommand: `${MYHABEETAT_COMMAND_BASE}/HVACSendCommand`
  }
}
