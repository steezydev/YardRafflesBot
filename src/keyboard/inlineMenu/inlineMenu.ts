import { MenuMiddleware } from 'telegraf-inline-menu'

import { mainTemplate } from './templates/mainTemplate'

const menuMiddleware = new MenuMiddleware('/', mainTemplate)

export { menuMiddleware }
