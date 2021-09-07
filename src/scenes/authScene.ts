import { Composer, Scenes, Markup } from "telegraf";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
  ParseError,
  PhoneNumber,
} from "libphonenumber-js";
import { SessionContext } from "../context/context";
import { keyboard } from "../keyboard";
import { template } from "../utils/templater";
import { UserModel } from "../models/userModel";

type PropOr<T, P extends string | symbol | number, D> = T extends Partial<
  Record<P, infer V>
>
  ? V
  : D;

type UnionKeys<T> = T extends unknown ? keyof T : never;

type Deunionize<T> =
  | ([undefined] extends [T] ? undefined : never)
  | {
      [K in UnionKeys<T>]: PropOr<NonNullable<T>, K, undefined>;
    };

function deunionize<T extends object | undefined>(t: T) {
  return t as Deunionize<T>;
}

const userModel = new UserModel();

// HELPER
function getPhoneNumber(phone: string): PhoneNumber | undefined {
  try {
    const phoneNumber = parsePhoneNumberWithError(phone, "RU");

    if (!isValidPhoneNumber(phone, "RU")) {
      return undefined;
    }

    return phoneNumber;
  } catch (err) {
    if (err instanceof ParseError) {
      return undefined;
    } else {
      throw err;
    }
  }
}

const getPhoneNumberStep = new Composer<SessionContext>();
getPhoneNumberStep.on("text", async (ctx) => {
  // Получем номер телефона из сообщения
  const phone = ctx.message.text;

  const phoneNumber = getPhoneNumber(phone);

  if (phoneNumber === undefined) {
    ctx.reply("❗️Введите действительный номер телефона❗️");
    await ctx.reply("📞 Ваш номер телефона: ");
    return;
  }

  // Проверка телефона на наличие в БД
  const phoneExists = await userModel.checkPhoneNumber(
    phoneNumber.number.toString()
  );
  if (phoneExists) {
    ctx.reply("❗️Такой номер уже зарегистрирован❗️");
    await ctx.reply("📞 Ваш номер телефона: ");
    return;
  }

  const user = await userModel.addUser(
    {
      telegramId: ctx.from.id,
      username: ctx.from.first_name,
      telegramLink: ctx.from.username,
      phone: phoneNumber.number.toString(),
    },
    ctx.session.reffHash
  );

  console.log(user);

  if (user === undefined) {
    ctx.reply("❗️Что-то пошло не так❗️");
    ctx.reply("Попробуйте ввести номер телефона снова...");
    return;
  }

  // Если все хорошо, то сообщеняем пользователю, отправляем клавиатуру и выходим из сцены
  await ctx.reply("Поздравляю, регистрация прошла успешно!");
  await ctx.reply(`Чтобы начать работу с ботом, воспользуйтесь командами`);
  return await ctx.scene.leave();
});
getPhoneNumberStep.use((ctx) =>
  ctx.replyWithMarkdown("📞 Введите номер телефона")
);

export const authWizard = new Scenes.WizardScene(
  "auth-wizard",
  async (ctx) => {
    // Referal hash
    const startPayload = deunionize(ctx.message)?.text!.toLowerCase();
    const reffHash = startPayload!.split(" ")[1];

    ctx.session.reffHash = reffHash;

    // Проверка пользователя в БД
    const userExists = await userModel.checkUserExists(ctx.from?.id!);

    // Если пользователь существет, выходим из сцены
    if (userExists) {
      await ctx.reply(`Добро пожаловать назад, ${ctx.from!.first_name}`);
      await ctx.reply(template("menu", "guide", {}), {
        parse_mode: "MarkdownV2",
      });
      return await ctx.scene.leave();
    }

    // Если пользователя нет в БД, посылаем сообщение - приветсвие и просим ввести номер телефона
    const text = template("welcome", "unregistered_wellcome", {
      username: ctx.from!.first_name,
    });
    await ctx.reply(text, Markup.removeKeyboard());
    await ctx.reply("📞 Ваш номер телефона: ");
    return ctx.wizard.next();
  },
  getPhoneNumberStep
);
