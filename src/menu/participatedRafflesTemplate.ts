import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { SessionContext } from '../context/context'
import { RafflesModel } from '../models/rafflesModel'
import { dateFormatter, isDateExpired } from '../utils/dateHelper'
const isImageUrl = require('is-image-url');

const wonChoices: Record<string, string> = {
  won: '🏆 Выиграл',
  lost: '👎 Не выиграл',
}

const rafflesModel = new RafflesModel()

const ENTRIES_PER_PAGE = 4

async function getAllEntries(context: SessionContext) {
  // Getting active raffles list
  const raffles = await rafflesModel.getPartRaffles(context.from?.id!)

  const entries: Record<string, string> = {}

  // Generating entries
  for (const [key, value] of Object.entries(raffles)) {
    let raffle = value
    entries['id' + raffle.id] = raffle.work_name
  }

  return entries
}

async function getButtonEntries(context: SessionContext) {
  // Getting active raffles list
  const raffles = await rafflesModel.getPartRaffles(context.from?.id!)

  const entries: Record<string, string> = {}

  // Generating entries
  for (const [key, value] of Object.entries(raffles)) {
    let raffle = value

    if (raffle.userStatus != 2 && raffle.userStatus != 3) entries['id' + raffle.id] = raffle.work_name
  }

  return entries
}

// Generating menu body
async function menuBody(context: SessionContext): Promise<string> {
  const raffles = await rafflesModel.getPartRaffles(context.from?.id!)

  // If no active raffles
  if (Object.keys(raffles).length == 0) {
    return '*Вы пока не участвовали ни в одном раффле*'
  }

  const allEntries = await getAllEntries(context)

  if (context.session.partRafflesPage === undefined || Math.ceil(Object.keys(allEntries).length / ENTRIES_PER_PAGE) < context.session.partRafflesPage) {
    context.session.partRafflesPage = 1
  }

  const rafflesObj = raffles
  const pageIndex = (context.session.partRafflesPage ?? 1) - 1

  rafflesObj.length = Object.keys(allEntries).length;
  const currentPageEntries = Array.prototype.slice.call(rafflesObj, pageIndex * ENTRIES_PER_PAGE, (pageIndex + 1) * ENTRIES_PER_PAGE);


  let text = `[[${pageIndex + 1}/${Math.ceil(Object.keys(allEntries).length / ENTRIES_PER_PAGE)}]]\n` // Page number
  text += '*Раффлы в которых вы участвовали*\n\n'

  let state: string

  for (const [key, value] of Object.entries(currentPageEntries)) {
    if (isDateExpired(value.close_date)) {
      if (value.userStatus == 2) {
        state = '`Выиграл`'
      } else if (value.userStatus == 3) {
        state = '`Не выиграл`'
      } else {
        state = '`Ожидает`'
      }
    } else {
      state = '`Активен`'
    }

    text += `🔹*${value.work_name}*${value.userStatus == 2 ? '🏆' : ''}\n`
    text += `_Доход:_ ${value.profit !== '' ? value.profit + '₽' : 'оговаривается'}\n`
    text += `_Закрытие:_ ${dateFormatter(value.close_date)}\n`
    text += `_Состояние:_ ${state}\n`
    text += `\n`
  }

  return text
}

const participatedRafflesTemplate = new MenuTemplate<SessionContext>(async context => {
  return { text: await menuBody(context), parse_mode: 'Markdown' }
})

const detailsMenuTemplate = new MenuTemplate<SessionContext>(async ctx => {
  // Getting raffle id
  const id = parseInt(ctx.match![1].slice(2))

  // Setting current opened raffle id into session
  ctx.session.currentRafflesId = id

  // Getting raffle via API
  const raffle = await rafflesModel.getRaffle(id, ctx.from?.id!)

  ctx.session.raffleClosed = isDateExpired(raffle.close_date)

  ctx.session.currentRafflesStatus = raffle.userStatus ? true : false
  ctx.session.currentRafflesWaiting = (raffle.userStatus == 2 || raffle.userStatus == 3) ? false : true

  let text = `*${raffle.work_name}*\n`
  text += `${raffle.message}\n\n`

  text += `_До:_ ${dateFormatter(raffle.close_date)}\n`
  text += `_Размеры:_ ${raffle.profit !== '' ? raffle.sizes : '-'}\n`
  text += `_Доход:_ ${raffle.profit !== '' ? raffle.profit + '₽' : 'оговаривается'}\n`
  text += `_Ссылка на регистрацию:_\n${raffle.link}\n`

  const imageUrl = raffle.images.split('?')[0].trim()

  if (imageUrl.length > 0 && isImageUrl(imageUrl)) {
    return {
      type: 'photo',
      media: imageUrl,
      text,
      parse_mode: 'Markdown'
    }
  } else {
    return {
      text,
      parse_mode: 'Markdown'
    }
  }
})

// Adding entries menu
participatedRafflesTemplate.chooseIntoSubmenu('details', getButtonEntries, detailsMenuTemplate, {
  maxRows: 2,
  columns: ENTRIES_PER_PAGE / 2,
  getCurrentPage: context => context.session.partRafflesPage
})

// Particiaption button
detailsMenuTemplate.toggle('Участвую', 'raffle_reg', {
  hide: (ctx) => ctx.session.raffleClosed,
  set: async (ctx, newState) => {
    // Sending new status to API
    await rafflesModel.setRartRaffle(newState, ctx.session.currentRafflesId, ctx.from?.id!)

    ctx.session.currentRafflesStatus = newState
    return true
  },
  formatState: (context, text, state) => `${state ? '🚫 Не участвую' : '✅ Участвую'}`,
  isSet: (ctx) => ctx.session.currentRafflesStatus
})

// Won Button
detailsMenuTemplate.choose('raffle_won', wonChoices, {
  hide: (ctx) => !(ctx.session.raffleClosed && ctx.session.currentRafflesWaiting),
  do: async (ctx, key) => {
    if (key == 'won') {
      await rafflesModel.confirmSuccess(ctx.session.currentRafflesId, ctx.from?.id!)
      await ctx.answerCbQuery(`😍🥳🤩`)
    } else {
      await rafflesModel.confirmLoss(ctx.session.currentRafflesId, ctx.from?.id!)
      await ctx.answerCbQuery(`😥😓😢`)
    }

    return '..'
  }
})

detailsMenuTemplate.manualRow(createBackMainMenuButtons('🔙 Назад', ''))

// Pagination buttons
async function getCustomPaginationButtons(context: any) {
  const allEntries = await getAllEntries(context)

  if (Object.keys(allEntries).length === 0 || Object.keys(allEntries).length <= ENTRIES_PER_PAGE) {
    return []
  }

  if (context.session.partRafflesPage === 1) {
    return [[{ text: '▶️', relativePath: `custom-pagination:${context.session.partRafflesPage + 1}` }]]
  }
  if (context.session.partRafflesPage === Math.ceil(Object.keys(allEntries).length / ENTRIES_PER_PAGE)) {
    return [[{ text: '◀️', relativePath: `custom-pagination:${context.session.partRafflesPage - 1}` }]]
  }
  return [[{ text: '◀️', relativePath: `custom-pagination:${context.session.partRafflesPage - 1}` }, { text: '▶️', relativePath: `custom-pagination:${context.session.partRafflesPage + 1}` }]]
}

// Custom pagination
participatedRafflesTemplate.manualRow(getCustomPaginationButtons)
participatedRafflesTemplate.manualAction(/custom-pagination:(\d+)$/, (context, path) => {
  context.session.partRafflesPage = parseInt(context.match![1])
  return '.'
})


participatedRafflesTemplate.manualRow(createBackMainMenuButtons('🔙 Назад', ''))

export { participatedRafflesTemplate }