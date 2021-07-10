import { MenuMiddleware } from 'telegraf-inline-menu'
import { mainTemplate } from './mainTemplate'
import { rafflesTemplate } from './rafflesTemplate'
import { profileTemplate } from './profileTemplate'

//export const menuMiddleware = new MenuMiddleware('/', mainTemplate)
export const rafflesMenu = new MenuMiddleware('/', rafflesTemplate)
export const profileMenu = new MenuMiddleware('/', profileTemplate)

