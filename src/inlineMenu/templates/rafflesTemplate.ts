import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { myRafflesTemplate } from './myRafflesTemplate'
const { raffles: rafflesButtons } = require('../inlineButtons.json')
import { RafflesModel } from '../../models/rafflesModel'

const rafflesModel = new RafflesModel()

interface MyContext extends Context {
  readonly match: RegExpExecArray | undefined
}

const rafflesTemplate = new MenuTemplate<MyContext>(async ctx => {
  const text = await rafflesModel.rafflesText()
  return { text, parse_mode: 'Markdown' }
})


rafflesTemplate.submenu(rafflesButtons.my.title, rafflesButtons.my.callback, myRafflesTemplate)

rafflesTemplate.interact(rafflesButtons.active.title, rafflesButtons.active.callback, {
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

rafflesTemplate.interact(rafflesButtons.history.title, rafflesButtons.history.callback, {
  joinLastRow: true,
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

rafflesTemplate.manualRow(createBackMainMenuButtons('↩️', '↩️'))



export { rafflesTemplate }