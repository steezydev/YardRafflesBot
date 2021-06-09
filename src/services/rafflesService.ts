import { ApiService } from './apiService'

export class RafflesService extends ApiService {
  public async getRafflsStats(): Promise<object> {
    const response = await this.get('/bot/getRafflesStats', {})
    return response.data
  }

  public async getMyRafflsStats(telegramId: number): Promise<object> {
    const response = await this.get(`/bot/getUserRafflesStats/${telegramId}`, {})
    if (response === undefined) return {}
    return response.data
  }
}