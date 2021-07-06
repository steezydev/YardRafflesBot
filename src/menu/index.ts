import { MenuMiddleware } from 'telegraf-inline-menu'
import { mainTemplate } from './mainTemplate'

const menuMiddleware = new MenuMiddleware('/', mainTemplate)

export { menuMiddleware }
