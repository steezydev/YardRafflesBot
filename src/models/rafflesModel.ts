import { template } from '../utils/templater/templater'

export class Raffles {
  private async getRafflsStats() {
    // 
  }

  private async getMyRafflsStats() {
    // 
  }

  async rafflesText(telegramId: number): Promise<string> {
    //console.log(telegramId)

    // Request to /api/bot/getUserRafflesStats/:telegramId

    return template('raffles', 'index', {
      active: 5,
      history: 95,
    })
  }

  async myRafflesText(telegramId: number): Promise<string> {
    //console.log(telegramId)

    // Request to /api/bot/getUserRafflesStats/:telegramId

    return template('myRaffles', 'index', {
      current: 2,
      participated: 15,
      won: 4,
    })
  }
}