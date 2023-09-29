import axios from 'axios';
import { config } from 'dotenv';
config();

// define information of telegram bot
const CHAT_ID = 
const BOT_TOKEN = 
const BOT_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// send message to telegram bot

// Define the request payload
const sendNotification =  (message)=>{
    console.log(CHAT_ID,BOT_TOKEN,BOT_URL)
    const payload = {
        chat_id: CHAT_ID,
        text: message,
      };
    return axios
    .post(BOT_URL, payload)
    .then(response => {
    })
    .catch(error => {
      console.error('Error sending message:');
    });
}

export default sendNotification;