import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { RafflesModel } from '../models/rafflesModel'
import { myRaffles as myrafflesButtons } from '../constants/inlineButtons.json'
import { SessionContext } from '../context/context'

import { participatedRafflesTemplate } from './participatedRafflesTemplate';
import { wonRafflesTemplate } from './wonRafflesTemplate';
import { currPartRafflesTemplate } from './currPartRafflesTemplate'

const rafflesModel = new RafflesModel()


const myRafflesTemplate = new MenuTemplate<SessionContext>(async ctx => {
  const text = await rafflesModel.myRafflesText(ctx.from?.id!)
  return { text, parse_mode: 'Markdown' }
})

// * MY RAFFLES BUTTONS *

// Active raffles user takes part in
myRafflesTemplate.submenu(myrafflesButtons.active.title, myrafflesButtons.active.callback, currPartRafflesTemplate)

// Raffles user took part in
myRafflesTemplate.submenu(myrafflesButtons.participated.title, myrafflesButtons.participated.callback, participatedRafflesTemplate)


// Raffles user won
myRafflesTemplate.submenu(myrafflesButtons.won.title, myrafflesButtons.won.callback, wonRafflesTemplate, {
  joinLastRow: true
})

myRafflesTemplate.manualRow(createBackMainMenuButtons('↩️', ''))

export { myRafflesTemplate }