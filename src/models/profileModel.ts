import { template } from '../utils/templater/templater'

export class ProfileModel {

  /** 
   * Templates text for Profile menu 
   * 
   * @returns Templated text for Profile menu 
   * */
  async profileMenuText(): Promise<string> {
    return template('profile', 'index', {})
  }
}