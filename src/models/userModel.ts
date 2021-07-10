import { UserService } from '../services/userService'
import * as _ from 'underscore'

const userService = new UserService()

interface UserData {
  telegramId: number
  username: string
  telegramLink: string | undefined
  phone: string
}

export class UserModel {

  /** 
   * Checks for user in DB
   * 
   * @returns True or false
   * */
  async checkUserExists(telegramId: number): Promise<boolean> {
    const user = await userService.getUser(telegramId)

    return !_.isEmpty(user)
  }

  /** 
   * Checks if phone number already exists
   * 
   * @returns True or false
   * */
  async checkPhoneNumber(phone: string): Promise<boolean> {
    const status = await userService.checkPhoneNumber(phone)

    return status
  }

  /** 
   * Checks if phone number already exists
   * 
   * @returns True or false
   * */
  async addUser(userData: UserData, reffHash: string): Promise<object> {
    const user = await userService.addUser(userData, reffHash)

    return user
  }
}