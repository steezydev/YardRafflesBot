import { ApiService } from './apiService'

export class RafflesService extends ApiService {

  /**
   * Requests raffle stats from `/bot/getRafflesStats`
   * 
   * @returns Response data with stats 
   */
  public async getRafflesStats(): Promise<object> {
    const response = await this.get('/bot/getRafflesStats', {})
    if (response === undefined) return {}
    return response.data
  }

  /**
   * Requests raffle stats for user from `/bot/getUserRafflesStats/:telegramId`
   * 
   * @param {number} User's telegram id
   * @returns Response data with stats 
   */
  public async getMyRafflesStats(telegramId: number): Promise<object> {
    const response = await this.get(`/bot/getUserRafflesStats/${telegramId}`, {})
    if (response === undefined) return {}
    return response.data
  }
}