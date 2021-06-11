import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Context } from 'telegraf'
import { ProfileModel } from '../../models/profileModel'
import { profile as profileButtons } from '../inlineButtons.json'

const profileModel = new ProfileModel()

interface MyContext extends Context {
  readonly match: RegExpExecArray | undefined
}

const profileTemplate = new MenuTemplate<MyContext>(async ctx => {
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
profileTemplate.interact(profileButtons.refs.title, profileButtons.refs.callback, {
  // TODO: User referral stats
  do: async ctx => {
    await ctx.answerCbQuery('yaay')
    return false
  }
})

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