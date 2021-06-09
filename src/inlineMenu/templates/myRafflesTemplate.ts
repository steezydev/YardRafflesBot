import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
const { myRaffles } = require('../inlineButtons.json')
import { RafflesModel } from '../../models/rafflesModel'

const rafflesModel = new RafflesModel()

interface MyContext extends Context {
  readonly match: RegExpExecArray | undefined
}

const myRafflesTemplate = new MenuTemplate<MyContext>(async ctx => {
  const text = await rafflesModel.myRafflesText(ctx.from?.id!)
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