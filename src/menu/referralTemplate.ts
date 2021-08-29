import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { SessionContext } from '../context/context'
import { QRCodeGen } from '../utils/QRCodeGenerator'
import { UserModel } from '../models/userModel'

const QRCodeModel = new QRCodeGen()
const userModel = new UserModel()


const referralTemplate = new MenuTemplate<SessionContext>(async context => {
    const user = await userModel.getUser(context.from?.id!)
    const refCount = await userModel.getRefCount(context.from?.id!)
    const refLink = process.env.BOT_INVITE_URL + '?start=' + user.refHash
    const refs = 0

    if (refCount == null) {
        return {
            text: 'Произошла ошибка!'
        }
    }

    const text = `*Количество ваших рефералов*\n_🔹1-ого уровня:_ ${refCount.firstLevel}\n_🔹2-ого уровня:_ ${refCount.secondLevel}\n_🔹3-ого уровня:_ ${refCount.thirdLevel}\n\nВаша реферальная ссылка:\n${refLink}`

    //const text = `У вас *${refs}* рефералов\n\nВаша реферальная ссылка:\n${refLink}`

    return {
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
    }
})

const referralQRTemplate = new MenuTemplate<SessionContext>(async context => {
    const user = await userModel.getUser(context.from?.id!)
    const QRCode = await QRCodeModel.makeReferralQRCode(user.refHash)

    const text = `🧾 QR для приглашения`

    return {
        type: 'photo',
        media: {
            source: Buffer.from(QRCode, 'base64')
        },
        text,
        parse_mode: 'Markdown'
    }
})

referralTemplate.submenu('🧾Показать QR код', 'getRefQR', referralQRTemplate)

referralQRTemplate.manualRow(createBackMainMenuButtons('🔙 Назад', ''))
referralTemplate.manualRow(createBackMainMenuButtons('🔙 Назад', ''))

export { referralTemplate }