import { Composer, Scenes, Markup } from 'telegraf'
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js'
import { SessionContext } from '../context/context'
import { keyboard } from '../keyboard'
import { template } from '../utils/templater'
import { UserModel } from '../models/userModel'

const userModel = new UserModel()

const getPhoneNumberStep = new Composer<SessionContext>()
getPhoneNumberStep.on('text', async (ctx) => {
  // Получем номер телефона из сообщения
  const phone = ctx.message.text
  const phoneNumber = parsePhoneNumber(phone, 'RU')

  if (!isValidPhoneNumber(phone, 'RU')) {
    ctx.reply('❗️Введите действительный номер телефона❗️')
    await ctx.reply('📞 Ваш номер телефона: ')
    return
  }

  // Проверка телефона на наличие в БД
  const phoneExists = await userModel.checkPhoneNumber(phoneNumber.number.toString())
  if (phoneExists) {
    ctx.reply('❗️Такой номер уже зарегистрирован❗️')
    await ctx.reply('📞 Ваш номер телефона: ')
    return
  }

  const user = await userModel.addUser({
    telegramId: ctx.from.id,
    username: ctx.from.first_name,
    telegramLink: ctx.from.username,
    phone: phoneNumber.number.toString()
  })

  if (user === {}) {
    ctx.reply('❗️Что-то пошло не так❗️')
    ctx.reply('Попробуйте ввести номер телефона снова...')
    return
  }

  // Если все хорошо, то сообщеняем пользователю, отправляем клавиатуру и выходим из сцены
  await ctx.reply('Поздравляю, регистрация прошла успешно!', Markup
    .keyboard(keyboard.home)
    .oneTime()
    .resize())
  return await ctx.scene.leave()
})
getPhoneNumberStep.use((ctx) =>
  ctx.replyWithMarkdown('📞 Введите номер телефона')
)

export const authWizard = new Scenes.WizardScene(
  'auth-wizard',
  async (ctx) => {
    // Проверка пользователя в БД
    const userExists = await userModel.checkUserExists(ctx.from?.id!)

    // Если пользователь существет, выходим из сцены
    if (userExists) {
      await ctx.reply(`Добро пожаловать назад, ${ctx.from!.first_name}`, Markup
        .keyboard(keyboard.home)
        .oneTime()
        .resize())
      return await ctx.scene.leave()
    }

    // Если пользователя нет в БД, посылаем сообщение - приветсвие и просим ввести номер телефона
    const text = template('welcome', 'unregistered_wellcome', {
      username: ctx.from!.first_name
    })
    await ctx.reply(text, Markup.removeKeyboard())
    await ctx.reply('📞 Ваш номер телефона: ')
    return ctx.wizard.next()
  },
  getPhoneNumberStep
)