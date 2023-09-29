import axios from 'axios';
import * as cheerio from 'cheerio';
import sendNotification from "./telegram_bot.js";
const XPATH_STATUS = '.beta-status span';
const TESTFLIGHT_URL = 'https://testflight.apple.com/join/';
const FULL_TEXT = 'This beta is full.';
const ID_LIST = ['gdE4pRzI','MY6JTzix','fzDLkIVK'];

function watch(watchIds, callback, notifyFull = true, sleepTime = 10000) {
    setInterval(async () => {
   const watcher =  async () => {
        for (const tfId of watchIds) {
            try {
                const response = await axios.get(TESTFLIGHT_URL + tfId, {
                    headers: { 'Accept-Language': 'en-us' }
                });
                const $ = cheerio.load(response.data);
                const statusText = $(XPATH_STATUS).text().trim();
                console.log(tfId," : ",statusText)
                const freeSlots = statusText !== FULL_TEXT;

                if(freeSlots)
                {
                    const message = `${TESTFLIGHT_URL + tfId}`
                    await callback(message);
                }
            } catch (error) {
                console.error("Error fetching TestFlight page:", error);
            }
        }
    }
    watcher();
    }, sleepTime);  
}

watch(ID_LIST, sendNotification, true, 10000);

export default watch;
