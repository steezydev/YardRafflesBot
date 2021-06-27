import { Telegraf, Scenes } from 'telegraf'
import { SessionContext } from './context/context'
import { keyboardButtons } from './keyboard'
import { menuMiddleware } from './menu'
import { authWizard } from './scenes/authScene'

import { Db } from 'mongodb'
import { session } from 'telegraf-session-mongodb'

const token = process.env.BOT_TOKEN
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf<SessionContext>(token)

export const setup = (db: Db) => {
  const stage = new Scenes.Stage([authWizard])

  bot.use(session(db))
  bot.use(stage.middleware())

  // * MENU DECLARATION *
  bot.use(menuMiddleware)
  bot.hears(keyboardButtons.mainMenu.menu, ctx => menuMiddleware.replyToContext(ctx))

  // /start
  bot.start(ctx => ctx.scene.enter('auth-wizard'));

  return bot
}

