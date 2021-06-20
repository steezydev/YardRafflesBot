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

  /**
   * Requests raffle data
   * 
   * @param id {number} Raffle id
   * @returns Response data with raffle data 
   */
  public async getRaffle(id: number, telegramId: number) {
    const response = await this.get(`/bot/getRaffle/${id}`, {
      telegramId
    })
    if (response === undefined) return {}
    return response.data
  }

  /**
   * Requests active raffles data
   * 
   * @param telegramId {number} User's telegram id
   * @returns Response data with raffle data 
   */
  public async getActiveRaffles(telegramId: number) {
    const response = await this.get(`/bot/getCurrentRaffles`, {
      telegramId
    })
    if (response === undefined) return {}
    return response.data
  }

  /**
   * Requests current participated raffles data
   * 
   * @param telegramId {number} User's telegram id
   * @returns Response data with raffle data 
   */
   public async getCurrPartRaffles(telegramId: number) {
    const response = await this.get(`/bot/getCurrPartRaffles`, {
      telegramId
    })
    if (response === undefined) return {}
    return response.data
  }

  /**
   * Requests participated raffles data
   * 
   * @param telegramId {number} User's telegram id
   * @returns Response data with raffle data 
   */
   public async getPartRaffles(telegramId: number) {
    const response = await this.get(`/bot/getParticipatedRaffles`, {
      telegramId
    })
    if (response === undefined) return {}
    return response.data
  }

  /**
   * Requests won raffles data
   * 
   * @param telegramId {number} User's telegram id
   * @returns Response data with raffle data 
   */
   public async getWonRaffles(telegramId: number) {
    const response = await this.get(`/bot/getWonRaffles`, {
      telegramId
    })
    if (response === undefined) return {}
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
    const response = await this.post(`/bot/addPartRaffle/${raffleId}`, {}, {
      telegramId
    })

    if (response === undefined) return {}
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
    const response = await this.post(`/bot/removePartRaffle/${raffleId}`, {}, {
      telegramId
    })

    if (response === undefined) return {}
    return response.data
  }
}