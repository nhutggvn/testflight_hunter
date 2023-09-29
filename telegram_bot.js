import axios from 'axios';
import { config } from 'dotenv';
config();


// define information of telegram bot
const CHAT_ID = process.env.CHAT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;


// send message to telegram bot
const sendNotification =  (message)=>{
  // Define the request payload
    const payload = {
        chat_id: CHAT_ID,
        text: message,
      };
    // return a promise to post the payload to the bot
    return axios
    .post(BOT_URL, payload)
    .then(response => {

    })
    .catch(error => {
      console.error('sendNotification function: ', error);
    });
}

export default sendNotification;