import { MenuTemplate } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { template } from '../../../utils/templater/templater'

import { rafflesTemplate } from './rafflesTemplate'
import { profileTemplate } from './profileTemplate'
const { main } = require('../inlineButtons.json')

interface MyContext extends Context {
  readonly match: RegExpExecArray | undefined
}

// mock text
const text = template('menu', 'index', {})


const mainTemplate = new MenuTemplate<MyContext>(ctx => {
  return { text, parse_mode: 'Markdown' }
})


mainTemplate.submenu(main.raffles.title, main.raffles.callback, rafflesTemplate)

mainTemplate.interact(main.announces.title, main.announces.callback, {
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})
mainTemplate.submenu(main.profile.title, main.profile.callback, profileTemplate)

export { mainTemplate }