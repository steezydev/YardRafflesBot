import QRCode from 'qrcode'


export class QRCodeGen {
  async makeQRCode(hash: string) {
    try {
      const code = await QRCode.toDataURL(
        hash,
        {
          scale: 10
        }
      )
      return code.split(',')[1]
    } catch (err) {
      throw new Error(err)
    }
  }

  async makeSuccessQRCode(hash: string) {
    const adminUrl = process.env.QR_URL
    return await this.makeQRCode(adminUrl + hash)
  }
}