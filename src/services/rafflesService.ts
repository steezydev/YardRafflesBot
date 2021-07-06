import { ApiService } from './apiService'
import * as url from '../constants/endpoints'

export class RafflesService extends ApiService {

  /**
   * Requests raffle stats from `/bot/getRafflesStats`
   * 
   * @returns Response data with stats 
   */
  public async getRafflesStats(): Promise<object> {
    const response = await this.get(url.GET_RAFFLES_STATS, {})

    return response.data
  }

  /**
   * Requests raffle stats for user from `/bot/getUserRafflesStats/:telegramId`
   * 
   * @param {number} User's telegram id
   * @returns Response data with stats 
   */
  public async getMyRafflesStats(telegramId: number): Promise<object> {
    const response = await this.get(url.GET_USER_RAFFLES_STATS + telegramId, {})
    
    return response.data
  }

  /**
   * Requests raffle data
   * 
   * @param id {number} Raffle id
   * @returns Response data with raffle data 
   */
  public async getRaffle(id: number, telegramId: number) {
    const response = await this.get(url.GET_RAFFLE + id, {
      telegramId
    })
    
    return response.data
  }

  /**
   * Requests active raffles data
   * 
   * @param telegramId {number} User's telegram id
   * @returns Response data with raffle data 
   */
  public async getActiveRaffles(telegramId: number) {
    const response = await this.get(url.GET_CURRENT_RAFFLES, {
      telegramId
    })
    
    return response.data
  }

  /**
   * Requests current participated raffles data
   * 
   * @param telegramId {number} User's telegram id
   * @returns Response data with raffle data 
   */
  public async getCurrPartRaffles(telegramId: number) {
    const response = await this.get(url.GET_CURRENT_PART_RAFFLES, {
      telegramId
    })
    
    return response.data
  }

  /**
   * Requests participated raffles data
   * 
   * @param telegramId {number} User's telegram id
   * @returns Response data with raffle data 
   */
  public async getPartRaffles(telegramId: number) {
    const response = await this.get(url.GET_PARTICIPATED_RAFFLES, {
      telegramId
    })
    
    return response.data
  }

  /**
   * Requests won raffles data
   * 
   * @param telegramId {number} User's telegram id
   * @returns Response data with raffle data 
   */
  public async getWonRaffles(telegramId: number) {
    const response = await this.get(url.GET_WON_RAFFLES, {
      telegramId
    })
    
    return response.data
  }

  /**
   * Add raffle participation
   * 
   * @param raffleId {number} Raffle id
   * @param telegramId {number} User's telegram id
   * @returns status (1, 0)
   */
  public async addPartRaffle(raffleId: number, telegramId: number) {
    const response = await this.post(url.ADD_PARTICIPATION_RAFFLE + raffleId, {}, {
      telegramId
    })

    
    return response.data
  }

  /**
   * Remove raffle participation
   * 
   * @param raffleId {number} Raffle id
   * @param telegramId {number} User's telegram id
   * @returns status (1, 0)
   */
  public async removePartRaffle(raffleId: number, telegramId: number) {
    const response = await this.post(url.REMOVE_PARTICIPATION_RAFFLE + raffleId, {}, {
      telegramId
    })

    
    return response.data
  }

  /**
   * Confirm success participation
   * 
   * @param raffleId {number} Raffle id
   * @param telegramId {number} User's telegram id
   * @returns status (1, 0)
   */
  public async confirmSuccess(raffleId: number, telegramId: number) {
    const response = await this.put(url.CONFIRM_SUCCESS_RAFFLE + raffleId, {}, {
      telegramId
    })

    
    return response.data
  }

  /**
   * Confirm loss participation
   * 
   * @param raffleId {number} Raffle id
   * @param telegramId {number} User's telegram id
   * @returns status (1, 0)
   */
  public async confirmLoss(raffleId: number, telegramId: number) {
    const response = await this.put(url.CONFIRM_LOSS_RAFFLE + raffleId, {}, {
      telegramId
    })

    
    return response.data
  }
}