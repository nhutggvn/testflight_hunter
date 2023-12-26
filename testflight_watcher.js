import { config } from 'dotenv';
config();
import axios from 'axios';
import * as cheerio from 'cheerio';

import http from 'http';

import sendNotification from "./telegram_bot.js";


const XPATH_STATUS = '.beta-status span';
const TEST_FLIGHT_URL = 'https://testflight.apple.com/join/';
const FULL_TEXT = 'This beta is full.';
const NOT_OPEN_TEXT = "This beta isn't accepting any new testers right now.";
const ID_LIST = process.env.ID_LIST.split(',');
const SLEEP_TIME = process.env.INTERVAL_CHECK;
const TITLE_REGEX = /To join the (.*), open the link on your iPhone, iPad, or Mac after you install TestFlight./;

function watch(watchIds, sendNotification, sleepTime = 10000) {

  // send notification to telegram bot to check if the script is alive
  setInterval(async () => {
    const currentTime = new Date();
    const message = `I'm alive - ${currentTime}`
    await sendNotification(message);
    console.log(message);
  }, 60*60*1000);


  // create a server to keep the script alive
  const server = http.createServer(async function(req, res) {
    res.write("Bot is alive");
    res.end();
  });

  // listen to port 8080
  server.listen(8080);

  // watchIdSent is used to keep track of the watchIds that have been sent to the bot
  const watchIdSent = [];

  setTimeout(() => {
    watchIdSent.length = 0;
    console.log('watchIdSent list has been reset.');
  }, 24 * 60 * 60 * 1000); // Reset the list in 1 day (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  
  // start the watcher
  setInterval(async () => {
    const watcher = async () => {
      for (const tfId of watchIds) {
        try {
          const response = await axios.get(TEST_FLIGHT_URL + tfId, {
            headers: { 'Accept-Language': 'en-us' }
          });

          const $ = cheerio.load(response.data);
          const statusText = $(XPATH_STATUS).text().trim();
          const isAvailableSlot = statusText.match(TITLE_REGEX);
          const isFullSlot = statusText === FULL_TEXT;
          const isNotOpen = statusText === NOT_OPEN_TEXT;

          // case 1: Open for testing, slot available
          if(isAvailableSlot && !watchIdSent.includes(tfId))
          {
            const tfLink = `${TEST_FLIGHT_URL + tfId}`
            await sendNotification(tfLink);
            // add the tfId to the watchIdSent
            watchIdSent.push(tfId);
            console.log(response.status,` - ${tfId} - Slot available`)
          }
          
          // case 2: Open for testing, slot full
          if (isFullSlot) {
            console.log(response.status,` - ${tfId} - Full slot`)
          }

          // case 3: Not open for testing
          if (isNotOpen) {
            console.log(response.status,` - ${tfId} - Not open for testing`)
          }
        } catch (error) {
          // case 4: Invalid ID or Removed
          console.log(error.response.status, ` - ${tfId} - Invalid ID or Removed`)
        }
      }
    }
    watcher();
  }, sleepTime);
}


watch(ID_LIST, sendNotification, SLEEP_TIME);