require('dotenv').config()
process.setMaxListeners(0);

import { Markup, Scenes, Context, Telegraf } from 'telegraf'
// import {MenuTemplate, MenuMiddleware} from 'telegraf-inline-menu'
import { template } from './utils/templater/templater'
import { keyboard, keyboardButtons } from './keyboard/keyboard'
import { menuMiddleware } from './inlineMenu/inlineMenu'

const token = process.env.BOT_TOKEN
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

interface MyContext extends Context {
  readonly match: RegExpExecArray | undefined
}

const bot = new Telegraf<MyContext>(token)

// * MENU DECLARATION *
bot.use(menuMiddleware)
bot.hears(keyboardButtons.mainMenu.menu, ctx => menuMiddleware.replyToContext(ctx))

bot.start(ctx => {
  const text = template('welcome', 'unregistered_wellcome', {
    username: ctx.from.first_name
  })

  return ctx.reply(text, Markup
    .keyboard(keyboard.home)
    .oneTime()
    .resize())
})


bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))