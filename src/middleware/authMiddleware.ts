
import { UserModel } from '../models/userModel'
const userModel = new UserModel()

export const authMiddleware = async (ctx: any, next: any) => {
  const telegramId = ctx.from.id
  const userExists = await userModel.checkUserExists(telegramId)
  
  if (!userExists) {
    await ctx.scene.enter('auth-wizard')
    return
  }

  await next()
}