import { ApiService } from './apiService'
import * as url from '../constants/endpoints'

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
  public async getUser(telegramId: number) {
    const response = await this.get(url.GET_USER + telegramId, {})

    if (response === undefined) {
      return {}
    }

    return response.data
  }

  /**
   * Checks for phone number
   * 
   * @returns True or false
   */
  public async checkPhoneNumber(phone: string): Promise<boolean> {
    const response = await this.get(url.CHECK_PHONE, {
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
  public async addUser(userData: UserData, refHash: string): Promise<object> {
    const response = await this.post(url.ADD_USER, userData, (refHash !== undefined ? { refHash } : {}))

    return response.data
  }
}