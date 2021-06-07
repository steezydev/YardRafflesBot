import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { template } from '../../../utils/templater/templater'
const { myRaffles } = require('../inlineButtons.json')
import { Raffles } from '../../../models/rafflesModel'

const RafflesModel = new Raffles()

interface MyContext extends Context {
  readonly match: RegExpExecArray | undefined
}

const myRafflesTemplate = new MenuTemplate<MyContext>(async ctx => {
  const text = await RafflesModel.myRafflesText(ctx.from?.id!)
  return { text, parse_mode: 'Markdown' }
})

myRafflesTemplate.interact(myRaffles.active.title, myRaffles.active.callback, {
  do: async ctx => {
    await ctx.answerCbQuery('message')
    return false
  }
})

myRafflesTemplate.interact(myRaffles.participated.title, myRaffles.participated.callback, {
  do: async ctx => {
    await ctx.answerCbQuery('message')
    return false
  }
})

myRafflesTemplate.interact(myRaffles.won.title, myRaffles.won.callback, {
  joinLastRow: true,
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

myRafflesTemplate.manualRow(createBackMainMenuButtons('↩️', 'Главное меню 🗄'))

export { myRafflesTemplate }