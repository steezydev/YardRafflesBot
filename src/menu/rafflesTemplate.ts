import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'

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


// Active Raffles button
rafflesTemplate.submenu(rafflesButtons.active.title, rafflesButtons.active.callback, activeRafflesTemplate)

// My Raffles button
rafflesTemplate.submenu(rafflesButtons.my.title, rafflesButtons.my.callback, myRafflesTemplate)

rafflesTemplate.manualRow(createBackMainMenuButtons('↩️', '↩️'))

export { rafflesTemplate }