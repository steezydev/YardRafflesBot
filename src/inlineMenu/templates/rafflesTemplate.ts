import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { myRafflesTemplate } from './myRafflesTemplate'
import { RafflesModel } from '../../models/rafflesModel'
import {raffles as rafflesButtons} from '../inlineButtons.json'

const rafflesModel = new RafflesModel()

interface MyContext extends Context {
  readonly match: RegExpExecArray | undefined
}

const rafflesTemplate = new MenuTemplate<MyContext>(async ctx => {
  const text = await rafflesModel.rafflesText()
  return { text, parse_mode: 'Markdown' }
})

// * RAFFLES BUTTONS *

// My Raffles button
rafflesTemplate.submenu(rafflesButtons.my.title, rafflesButtons.my.callback, myRafflesTemplate)

// Active Raffles button
rafflesTemplate.interact(rafflesButtons.active.title, rafflesButtons.active.callback, {
  // TODO: Active raffles list
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

// Raffels History button
rafflesTemplate.interact(rafflesButtons.history.title, rafflesButtons.history.callback, {
  // TODO: History raffles list
  joinLastRow: true,
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})


rafflesTemplate.manualRow(createBackMainMenuButtons('↩️', '↩️'))

export { rafflesTemplate }