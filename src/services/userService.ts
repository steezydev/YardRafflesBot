import { ApiService } from './apiService'

interface UserData {
  telegramId: number
  username: string
  telegramLink: string | undefined
  phone: string
}

export class UserService extends ApiService {

  /**
   * Get User `/bot/getUser`
   * 
   * @returns Response with user data
   */
  public async getUser(telegramId: number): Promise<object> {
    const response = await this.get(`/bot/getUser/${telegramId}`, {})
    if (response === undefined) return {}

    return response.data
  }

  /**
   * Checks for phone number
   * 
   * @returns True or false
   */
   public async checkPhoneNumber(phone: string): Promise<boolean> {
    const response = await this.get(`/bot/checkPhone`, {
      phone
    })
    if (response === undefined) return true

    return response.data.status
  }

  /**
   * Add a new user
   * 
   * @returns User data
   */
   public async addUser(userData: UserData): Promise<object> {
    const response = await this.post(`/bot/addUser`, userData, {})
    if (response === undefined) return {}

    return response.data
  }
}