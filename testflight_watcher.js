import { config } from 'dotenv';
config();
import axios from 'axios';
import * as cheerio from 'cheerio';


import sendNotification from "./telegram_bot.js";


const XPATH_STATUS = '.beta-status span';
const TESTFLIGHT_URL = 'https://testflight.apple.com/join/';
const FULL_TEXT = 'This beta is full.';
const ID_LIST = process.env.ID_LIST.split(',');
const SLEEP_TIME = process.env.INTERVAL_CHECK;

function watch(watchIds, sendNotification,sleepTime = 10000) {
    setInterval(async () => {
   const watcher =  async () => {
        for (const tfId of watchIds) {
            try {
                const response = await axios.get(TESTFLIGHT_URL + tfId, {
                    headers: { 'Accept-Language': 'en-us' }
                });
                const $ = cheerio.load(response.data);
                const statusText = $(XPATH_STATUS).text().trim();
                const freeSlots = statusText !== FULL_TEXT;

                if(freeSlots)
                {
                    const message = `${TESTFLIGHT_URL + tfId}`
                    await sendNotification(message);
                }
                console.log(`Status: ${statusText}`)
            } catch (error) {
                console.error("watch function: ", error);
            }
        }
    }
    watcher();
    }, sleepTime);  
}

watch(ID_LIST, sendNotification,SLEEP_TIME);