import axios from 'axios';
import constant from './constant.js';
// send message to telegram bot
const sendTopic =  async (message,chatId,topicId)=>{
  // Define the request payload
    const payload = {
        chat_id: chatId,
        text: message,
        reply_to_message_id:topicId,
      };
    // return a promise to post the payload to the bot
    try {
    const response = await axios
      .post(constant.BOT_URL, payload);
    console.log('Send Notification Success!!!');
    console.log(response.status, ` - ${message}`);
  } catch (error) {
    console.log('Send Notification Failed!!!');
    console.log(error.response.status, ` - ${error.response.data.description}`);
  }
}

const botCustom = {
  sendTopic,
};
export default botCustom;