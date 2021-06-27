import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { SessionContext } from '../context/context'
import { RafflesModel } from '../models/rafflesModel'
import { dateFormatter, isDateExpired } from '../utils/dateHelper'

const rafflesModel = new RafflesModel()

const ENTRIES_PER_PAGE = 8

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

  for (const [key, value] of Object.entries(currentPageEntries)) {
    text += `🔹*${value.work_name}*${value.userStatus == 2 ? '🏆' : ''}\n`
    text += `_Доход:_ ${value.profit !== '' ? value.profit + '₽' : 'оговаривается'}\n`
    text += `_Закрытие:_ ${dateFormatter(value.close_date)}\n`
    text += `_Состояние:_ ${isDateExpired(value.close_date) ? '`Закрыт`' : '`Активен`'}\n`
    text += `\n`
  }

  return text
}

const participatedRafflesTemplate = new MenuTemplate<SessionContext>(async context => {
  return { text: await menuBody(context), parse_mode: 'Markdown' }
})

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