import { MenuTemplate } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { MainModel } from '../../models/mainModel'
import { rafflesTemplate } from './rafflesTemplate'
import { profileTemplate } from './profileTemplate'
import {main as mainButtons} from '../inlineButtons.json'

const mainModel = new MainModel()

interface MyContext extends Context {
  readonly match: RegExpExecArray | undefined
}

const mainTemplate = new MenuTemplate<MyContext>(async ctx => {
  const text = await mainModel.mainMenuText()
  return { text, parse_mode: 'Markdown' }
})

// * MAIN MENU BUTTONS *

// Raffles submenu
mainTemplate.submenu(mainButtons.raffles.title, mainButtons.raffles.callback, rafflesTemplate)

// Announces list
mainTemplate.interact(mainButtons.announces.title, mainButtons.announces.callback, {
  // TODO: Announces list
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

// Profile submenu
mainTemplate.submenu(mainButtons.profile.title, mainButtons.profile.callback, profileTemplate)

export { mainTemplate }