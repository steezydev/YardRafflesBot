import { Markup } from 'telegraf'
const kb = require('./keyboardButtons.json')

export const keyboard = {
  home: [
    [kb.mainMenu.menu, kb.mainMenu.about],
  ],
}

export const keyboardButtons = kb