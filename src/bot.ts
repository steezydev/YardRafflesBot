import { Telegraf, Scenes } from 'telegraf'
import { SessionContext } from './context/context'
import { keyboardButtons } from './keyboard'
import { rafflesMenu, profileMenu } from './menu'
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
  bot.use(rafflesMenu)
  bot.use(profileMenu)
  
  bot.start(ctx => ctx.scene.enter('auth-wizard'));

  /*
  bot.hears('/start', (ctx) => {
    const reffHash = ctx.match[1]

  })*/

  bot.command('raffles', (ctx) => rafflesMenu.replyToContext(ctx))

  bot.command('profile', (ctx) => profileMenu.replyToContext(ctx))

  return bot
}

