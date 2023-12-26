import axios from 'axios';
import { config } from 'dotenv';
config();


// define information of telegram bot
const CHAT_ID = process.env.CHAT_ID;
const BOT_WATCHER_TOKEN = process.env.BOT_WATCHER_TOKEN;
const BOT_URL = `https://api.telegram.org/bot${BOT_WATCHER_TOKEN}/sendMessage`;

// send message to telegram bot
const sendNotification =  (message)=>{
  // Define the request payload
    const payload = {
        chat_id: CHAT_ID,
        text: message,
        reply_to_message_id:3,
      };
    // return a promise to post the payload to the bot
    return axios
    .post(BOT_URL, payload)
    .then(response => {
        console.log('Send Notification Success!!!')
        console.log(response.status,` - ${message}`)
    })
    .catch(error => {
        console.log('Send Notification Failed!!!')
        console.log(error.response.status,` - ${error.response.data.description}`)
    });
}

export default sendNotification;