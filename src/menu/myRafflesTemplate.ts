import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { RafflesModel } from '../models/rafflesModel'
import { myRaffles as myrafflesButtons } from '../constants/inlineButtons.json'
import { SessionContext } from '../context/context'

const rafflesModel = new RafflesModel()


const myRafflesTemplate = new MenuTemplate<SessionContext>(async ctx => {
  const text = await rafflesModel.myRafflesText(ctx.from?.id!)
  return { text, parse_mode: 'Markdown' }
})

// * MY RAFFLES BUTTONS *

// Active raffles user takes part in
myRafflesTemplate.interact(myrafflesButtons.active.title, myrafflesButtons.active.callback, {
  // TODO: User active raffles list
  do: async ctx => {
    await ctx.answerCbQuery('message')
    return false
  }
})

// Raffles user took part in
myRafflesTemplate.interact(myrafflesButtons.participated.title, myrafflesButtons.participated.callback, {
  // TODO: Raffles user took part in list
  do: async ctx => {
    await ctx.answerCbQuery('message')
    return false
  }
})

// Raffles user won
myRafflesTemplate.interact(myrafflesButtons.won.title, myrafflesButtons.won.callback, {
  joinLastRow: true,
  // TODO: Raffles user won list
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

myRafflesTemplate.manualRow(createBackMainMenuButtons('↩️', 'Главное меню 🗄'))

export { myRafflesTemplate }