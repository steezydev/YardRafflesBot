import { template } from '../utils/templater'

export class MainModel {

  /** 
   * Templates text for Main menu 
   * 
   * @returns Templated text for Main menu 
   * */
  async mainMenuText(): Promise<string> {
    return template('menu', 'index', {})
  }
}