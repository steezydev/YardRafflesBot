import { UserService } from '../services/userService'
import * as _ from 'underscore'

const userService = new UserService()

interface UserData {
  telegramId: number
  username: string
  telegramLink: string | undefined
  phone: string
}

interface UserEntity {
  id: number
  username: string
  balance: number
  telegramId: number
  inviteId: number
  refHash: string
  phone: string
  email: string
  userRank: number
  dateRegister: string
  accepted: number
  blocked: number
  createdAt: string
  updatedAt: string
}

interface RefCount {
  firstLevel: number,
  secondLevel: number,
  thirdLevel: number,
}

export class UserModel {

  /** 
   * Checks for user in DB
   * 
   * @returns True or false
   * */
   async getUser(telegramId: number): Promise<UserEntity> {
    const user = await userService.getUser(telegramId)

    return user
  }

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

  /** 
   * Gets number of user's referrals for 3 levels of hierarchy
   * 
   * @returns object
   * */
   async getRefCount(telegramId: number): Promise<RefCount | null> {
    const refCount = await userService.getRefCount(telegramId)

    return refCount
  }
}