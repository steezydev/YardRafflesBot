import QRCode from 'qrcode'


export class QRCodeGen {
  async makeQRCode(hash: string) {
    try {
      const code = await QRCode.toDataURL(
        hash,
        {
          scale: 8
        }
      )
      return code.split(',')[1]
    } catch (err) {
      throw new Error(err)
    }
  }

  async makeReferralQRCode(hash: string) {
    const inviteUrl = process.env.BOT_INVITE_URL
    return await this.makeQRCode(inviteUrl + '?start=' + hash)
  }

  async makeSuccessQRCode(hash: string) {
    const adminUrl = process.env.QR_URL
    return await this.makeQRCode(adminUrl + hash)
  }
}