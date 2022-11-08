require('dotenv').config()

const TelegramAPI = require('node-telegram-bot-api')
const TgBot = new TelegramAPI(process.env.TG_TOKEN, { polling: true })

TgBot.setMyCommands([
  { command: '/start', description: "Начать общение с ботом" },
  { command: '/game', description: "Сыграем в игру 'Случайное число'" }
])

TgBot.on("message", async (msg) => {
  const chatId = msg.chat.id
  const userMessage = msg.text

  if (userMessage === "/start") return await startController(chatId) 
  if (userMessage === '/game') return await gameController(chatId)

  return await TgBot.sendMessage(chatId, "Что то пошло не так :(")
})

const chats = {}

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 1, callback_data: '1' }, { text: 2, callback_data: '2' }, { text: 3, callback_data: '3' }],
      [{ text: 4, callback_data: '4' }, { text: 5, callback_data: '5' }, { text: 6, callback_data: '6' }],
      [{ text: 7, callback_data: '7' }, { text: 8, callback_data: '8' }, { text: 9, callback_data: '9' }],
      [{ text: 0, callback_data: '0' }]
    ]
  })
}
const againOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Сыграть снова", callback_data: '/again' }]
    ]
  })
}

const gameController = async (chatId) => {

  const createGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = String(randomNumber)
    await TgBot.sendMessage(chatId, "Ну, попробуй", gameOptions)
  }

  await TgBot.sendSticker(chatId, "CAACAgIAAxkBAAEGWcZjahI4JLvK5exo6YxWCPEvfcdhcwAC5AQAAj6GlgbKMINAklWkGisE")
  await TgBot.sendMessage(chatId, "Я загадаю число от 0 до 9, а ты попробуй угадать")
  await createGame(chatId)
  TgBot.on("callback_query", async (msg) => {
    const message = msg.data
    if (message === '/again') {
      await createGame(chatId)
      return
    }
    await TgBot.sendMessage(chatId, `Ты выбрал число ${message}, а я загадал ${chats[chatId]}`)
    if (message === chats[chatId]) {
      await TgBot.sendSticker(chatId, "CAACAgIAAxkBAAEGWchjahJY4uYL90HwWJCMrMpc5GGfZgAC9wQAAj6GlgbFsCvTddRnbSsE")
      await TgBot.sendMessage(chatId, "Ты угадал!", againOptions)
      return
    }
    await TgBot.sendSticker(chatId, "CAACAgIAAxkBAAEGWcpjahK1DLYiOFnubb7HTCBmuIOK0wAC6QQAAj6Glga8AWuKjhwxCisE")
    await TgBot.sendMessage(chatId, "Я победил! Попробуй еще раз!", againOptions)
  })
  return
}
const startController = async (chatId) => {
  await TgBot.sendMessage(chatId, "Привет, добро пожаловать в моего бота!")
  return await TgBot.sendSticker(chatId, "CAACAgIAAxkBAAEGWcRjahIRsqLZsoFsn4xqzqgyLZJs2QAC1AQAAj6GlgY398e6at_soysE")
}