import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { ProfileModel } from '../models/profileModel'
import { profile as profileButtons } from '../constants/inlineButtons.json'
import { SessionContext } from '../context/context'

import { referralTemplate } from './referralTemplate'

const profileModel = new ProfileModel()



const profileTemplate = new MenuTemplate<SessionContext>(async ctx => {
  const text = await profileModel.profileMenuText()
  return { text, parse_mode: 'Markdown' }
})

// * PROFILE BUTTONS *

// User statistics
profileTemplate.interact(profileButtons.statistics.title, profileButtons.statistics.callback, {
  // TODO: User statistics
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

// User referrals
profileTemplate.submenu(profileButtons.refs.title, profileButtons.refs.callback, referralTemplate)

// User balance
profileTemplate.interact(profileButtons.balance.title, profileButtons.balance.callback, {
  joinLastRow: true,
  // TODO: User balance stats
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

profileTemplate.manualRow(createBackMainMenuButtons('↩️', '↩️'))



export { profileTemplate }