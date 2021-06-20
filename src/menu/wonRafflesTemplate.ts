import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu'
import { SessionContext } from '../context/context'
import { RafflesModel } from '../models/rafflesModel'
import { dateFormatter, isDateExpired } from '../utils/dateHelper'
import { QRCodeGen } from '../utils/qrCodeGenerator'

const rafflesModel = new RafflesModel()
const QRCodeModel = new QRCodeGen()

const ENTRIES_PER_PAGE = 4

async function getAllEntries(context: SessionContext) {
  // Getting active raffles list
  const raffles = await rafflesModel.getWonRaffles(context.from?.id!)

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
  const raffles = await rafflesModel.getWonRaffles(context.from?.id!)

  const entries: Record<string, string> = {}

  // Generating entries
  for (const [key, value] of Object.entries(raffles)) {
    let raffle = value
    if (!raffle.closed) entries['id' + raffle.id] = raffle.work_name
  }

  return entries
}

// Generating menu body
async function menuBody(context: SessionContext): Promise<string> {
  const raffles = await rafflesModel.getWonRaffles(context.from?.id!)

  // If no active raffles
  if (Object.keys(raffles).length == 0) {
    return '*Вы еще не победили ни в одном раффле*'
  }

  const allEntries = await getAllEntries(context)

  if (context.session.wonRafflesPage === undefined || Math.ceil(Object.keys(allEntries).length / ENTRIES_PER_PAGE) < context.session.wonRafflesPage) {
    context.session.wonRafflesPage = 1
  }

  const rafflesObj = raffles
  const pageIndex = (context.session.wonRafflesPage ?? 1) - 1

  rafflesObj.length = Object.keys(allEntries).length;
  const currentPageEntries = Array.prototype.slice.call(rafflesObj, pageIndex * ENTRIES_PER_PAGE, (pageIndex + 1) * ENTRIES_PER_PAGE);


  let text = `[[${pageIndex + 1}/${Math.ceil(Object.keys(allEntries).length / ENTRIES_PER_PAGE)}]]\n` // Page number
  text += '*Выигранные раффлы*\n_(нажав на кнопку внизу, вы можете получить персональный QR код для завершения сделки)_\n\n'

  for (const [key, value] of Object.entries(currentPageEntries)) {
    text += `🔹*${value.work_name}*\n`
    text += `_Доход:_ ${value.profit !== '' ? value.profit + '₽' : 'оговаривается'}\n`
    text += `_Завершен:_ ${dateFormatter(value.close_date)}\n`
    text += `_Статус:_ ${value.closed === 1 ? '`Сделка закрыта`' : '`Ожидает передачи`'}\n`
    text += `\n`
  }

  return text
}

const wonRafflesTemplate = new MenuTemplate<SessionContext>(async context => {
  return { text: await menuBody(context), parse_mode: 'Markdown' }
})


const detailsMenuTemplate = new MenuTemplate<SessionContext>(async ctx => {
  // Getting raffle id
  const id = parseInt(ctx.match![1].slice(2))

  // Setting current opened raffle id into session
  ctx.session.currentRafflesId = id

  // Getting raffle via API
  const raffle = await rafflesModel.getRaffle(id, ctx.from?.id!)

  ctx.session.currentRafflesStatus = raffle.userStatus ? true : false

  const QRCode = await QRCodeModel.makeSuccessQRCode(raffle.successHash)

  let text = `*QR код*`

  return {
    type: 'photo',
    media: {
      source: Buffer.from(QRCode, 'base64')
    },
    text,
    parse_mode: 'Markdown'
  }

})

// Adding entries menu
wonRafflesTemplate.chooseIntoSubmenu('details', getButtonEntries, detailsMenuTemplate, {
  maxRows: 2,
  columns: ENTRIES_PER_PAGE / 2,
  getCurrentPage: context => context.session.wonRafflesPage
})


detailsMenuTemplate.manualRow(createBackMainMenuButtons('🔙 Назад', ''))

// Pagination buttons
async function getCustomPaginationButtons(context: any) {
  const allEntries = await getAllEntries(context)

  if (Object.keys(allEntries).length === 0 || Object.keys(allEntries).length <= ENTRIES_PER_PAGE) {
    return []
  }

  if (context.session.wonRafflesPage === 1) {
    return [[{ text: '▶️', relativePath: `custom-pagination:${context.session.wonRafflesPage + 1}` }]]
  }
  if (context.session.wonRafflesPage === Math.ceil(Object.keys(allEntries).length / ENTRIES_PER_PAGE)) {
    return [[{ text: '◀️', relativePath: `custom-pagination:${context.session.wonRafflesPage - 1}` }]]
  }
  return [[{ text: '◀️', relativePath: `custom-pagination:${context.session.wonRafflesPage - 1}` }, { text: '▶️', relativePath: `custom-pagination:${context.session.wonRafflesPage + 1}` }]]
}

// Custom pagination
wonRafflesTemplate.manualRow(getCustomPaginationButtons)
wonRafflesTemplate.manualAction(/custom-pagination:(\d+)$/, (context, path) => {
  context.session.wonRafflesPage = parseInt(context.match![1])
  return '.'
})


wonRafflesTemplate.manualRow(createBackMainMenuButtons('🔙 Назад', ''))

export { wonRafflesTemplate }