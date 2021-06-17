import { template } from '../utils/templater'
import { RafflesService } from '../services/rafflesService'

const rafflesService = new RafflesService()

interface RaffleEntity {
  id: number;
  itemTitle: string;
  work_name: string;
  images: string;
  message: string;
  link: string;
  sizes: string;
  publication_date: string;
  publish: string;
  close_date: string;
  results_date: string;
  status: number;
  profit: string;
  userStatus: number;
}

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

  /** 
   * Gets Raffle by id
   * 
   * @param id {number} raffle id
   * @returns Raffle object
   * */
  async getRaffle(id: number, telegramId: number): Promise<RaffleEntity> {
    const raffle = await rafflesService.getRaffle(id, telegramId)

    return raffle
  }

  /** 
   * Gets Active Raffle
   * 
   * @param telegramId {number} User's telegram id
   * @returns Raffles object
   * */
  async getActiveRaffles(telegramId: number): Promise<RaffleEntity[]> {
    const raffles = await rafflesService.getActiveRaffles(telegramId)

    return raffles
  }

  async setRartRaffle(status: boolean, raffleId: number, telegramId: number) {
    if (status) {
      return await this.addPartRaffle(raffleId, telegramId)
    } else {
      return await this.removePartRaffle(raffleId, telegramId)
    }
  }

  /** 
   * Add raffle participation
   * 
   * @param raffleId {number} Raffle id
   * @param telegramId {number} User's telegram id
   * @returns status (1, 0)
   * */
  async addPartRaffle(raffleId: number, telegramId: number): Promise<boolean> {
    const status = await rafflesService.addPartRaffle(raffleId, telegramId)

    return status
  }

  /** 
   * Remove raffle participation
   * 
   * @param raffleId {number} Raffle id
   * @param telegramId {number} User's telegram id
   * @returns status (1, 0)
   * */
  async removePartRaffle(raffleId: number, telegramId: number): Promise<boolean> {
    const status = await rafflesService.removePartRaffle(raffleId, telegramId)

    return status
  }
}