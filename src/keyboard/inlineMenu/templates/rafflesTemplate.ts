import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { template } from '../../../utils/templater/templater'
import { myRafflesTemplate } from './myRafflesTemplate'
const { raffles: rafflesButtons } = require('../inlineButtons.json')
import { Raffles } from '../../../models/rafflesModel'

const RafflesModel = new Raffles()

interface MyContext extends Context {
  readonly match: RegExpExecArray | undefined
}

const rafflesTemplate = new MenuTemplate<MyContext>(async ctx => {
  const text = await RafflesModel.rafflesText(ctx.from?.id!)
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