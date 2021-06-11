import { template } from '../utils/templater/templater'
import { RafflesService } from '../services/rafflesService'

const rafflesService = new RafflesService()

export class RafflesModel {

  /** 
   * Templated stats for Raffles menu 
   * 
   * @returns Templated stats for Raffles menu 
   * */
  async rafflesText(): Promise<string> {
    const stats = await rafflesService.getRafflesStats()

    return template('raffles', 'index', stats)
  }

  /** 
   * Templated stats for Raffles menu 
   * 
   * @param {number} User's telegram id
   * @returns Templated stats for Raffles menu 
   * */
  async myRafflesText(telegramId: number): Promise<string> {
    const stats = await rafflesService.getMyRafflesStats(telegramId)

    return template('myRaffles', 'index', stats)
  }
}