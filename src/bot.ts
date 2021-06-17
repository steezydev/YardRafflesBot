import { Markup, Scenes, Context, Telegraf } from 'telegraf'
import { SessionContext } from './context/context'
import { template } from './utils/templater'
import { keyboard, keyboardButtons } from './keyboard'
import { menuMiddleware } from './menu'

import { Db } from 'mongodb'
import { session } from 'telegraf-session-mongodb'

const token = process.env.BOT_TOKEN
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf<SessionContext>(token)

export const setup = (db: Db) => {
  bot.use(session(db));

  // * MENU DECLARATION *
  bot.use(menuMiddleware)
  bot.hears(keyboardButtons.mainMenu.menu, ctx => menuMiddleware.replyToContext(ctx))

  // /start wellcome message
  bot.start(ctx => {
    const text = template('welcome', 'unregistered_wellcome', {
      username: ctx.from.first_name
    })

    return ctx.reply(text, Markup
      .keyboard(keyboard.home)
      .oneTime()
      .resize())
  })

  return bot
}

