import TelegramBot from 'node-telegram-bot-api';


import constant from './constant.js';
import botCustom from './botCustom.js';
import fileHandler from './fileHandler.js';
import utils from './utils.js';

// Create a new instance of TelegramBot with your bot token
const bot = new TelegramBot(constant.BOT_WATCHER_TOKEN, { polling: true });

// Handle the /add_testflight_id command with a topic
bot.onText(/\/add (.+)/, (msg, match) => {
  let testflightId = match[1];
  if(utils.isTfLink(testflightId)){
    testflightId = utils.getTfCode(testflightId);
    console.log(testflightId)
  }
  fileHandler.addTfId(testflightId, (message) => {
    botCustom.sendTopic(message,constant.CHAT_ID, constant.TOPIC_ID );
  });

});

bot.onText(/\/remove (.+)/, (msg, match) => {
  const testflightId = match[1];
  fileHandler.removeTfId(testflightId, (message) => {
    botCustom.sendTopic(message,constant.CHAT_ID, constant.TOPIC_ID );
  });

});

bot.onText(/\/list/, (msg) => {
  fileHandler.listTfId((message) => {
    botCustom.sendTopic(message,constant.CHAT_ID, constant.TOPIC_ID );
  });
});

// Handle unknown commands
// bot.onText(/\/help/, (msg) => {
//   const chatId = msg.chat.id;
//   // bot.sendMessage(chatId, 'Available commands:\n/add_testflight_id {ID} {Topic ID}');
// });

// Handle any incoming messages
// bot.on('message', (msg) => {
//   // You can add more logic here if needed
// });

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot is running...');

const telegramCommand = bot;

export default  telegramCommand;