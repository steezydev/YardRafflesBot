import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { template } from '../../../utils/templater/templater'

const { profile } = require('../inlineButtons.json')

interface MyContext extends Context {
  readonly match: RegExpExecArray | undefined
}

// mock text
const text = template('profile', 'index', {})

const profileTemplate = new MenuTemplate<MyContext>(ctx => {
  return { text, parse_mode: 'Markdown' }
})

profileTemplate.interact(profile.statistics.title, profile.statistics.callback, {
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

profileTemplate.interact(profile.reffs.title, profile.reffs.callback, {
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

profileTemplate.interact(profile.balance.title, profile.balance.callback, {
  joinLastRow: true,
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

profileTemplate.manualRow(createBackMainMenuButtons('↩️', '↩️'))



export { profileTemplate }