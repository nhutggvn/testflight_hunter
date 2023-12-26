import { config } from 'dotenv';
config();

const constant = {
    CHAT_ID: process.env.CHAT_ID,
    BOT_WATCHER_TOKEN : process.env.BOT_WATCHER_TOKEN,
    BOT_URL : `https://api.telegram.org/bot${process.env.BOT_WATCHER_TOKEN}/sendMessage`,
    TOPIC_ID: process.env.TOPIC_ID,
    IS_READING_FILE : false,
}

export default constant;