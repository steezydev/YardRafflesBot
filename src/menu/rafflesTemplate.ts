import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'

import { myRafflesTemplate } from './myRafflesTemplate'
import { activeRafflesTemplate } from './activeRafflesTemplate'

import { RafflesModel } from '../models/rafflesModel'
import {raffles as rafflesButtons} from '../constants/inlineButtons.json'
import { SessionContext } from '../context/context'

const rafflesModel = new RafflesModel()

const rafflesTemplate = new MenuTemplate<SessionContext>(async ctx => {
  const text = await rafflesModel.rafflesText()
  return { text, parse_mode: 'Markdown' }
})

// * RAFFLES BUTTONS *

// My Raffles button
rafflesTemplate.submenu(rafflesButtons.my.title, rafflesButtons.my.callback, myRafflesTemplate)

// Active Raffles button
rafflesTemplate.submenu(rafflesButtons.active.title, rafflesButtons.active.callback, activeRafflesTemplate)

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