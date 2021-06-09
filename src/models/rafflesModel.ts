import { template } from '../utils/templater/templater'
import { RafflesService } from '../services/rafflesService'

const rafflesService = new RafflesService()

export class RafflesModel {
  async rafflesText(): Promise<string> {
    const data = await rafflesService.getRafflsStats()

    return template('raffles', 'index', data)
  }

  async myRafflesText(telegramId: number): Promise<string> {
    const data = await rafflesService.getMyRafflsStats(telegramId)

    return template('myRaffles', 'index', data)
  }
}