import { config } from 'dotenv';
config();
import axios from 'axios';
import * as cheerio from 'cheerio';

import http from 'http';
import http from 'http';

import sendNotification from "./telegram_bot.js";


const XPATH_STATUS = '.beta-status span';
const TESTFLIGHT_URL = 'https://testflight.apple.com/join/';
const FULL_TEXT = 'This beta is full.';
const NOT_OPEN_TEXT = "This beta isn't accepting any new testers right now.";
const ID_LIST = process.env.ID_LIST.split(',');
const SLEEP_TIME = process.env.INTERVAL_CHECK;
const TITLE_REGEX = /Join the (.+) beta - TestFlight - Apple/;

function watch(watchIds, sendNotification, sleepTime = 10000) {

  setInterval(async () => {
    const currentTime = new Date();
    const message = `I'm alive - ${currentTime}`
    await sendNotification(message);
    console.log(message);
  }, 60*60*1000);


  // create a server to keep the script alive
  const server = http.createServer(async function(req, res) {
    res.write(`Bot is alive`);
    res.end();
  });

  server.listen(8080);

  setInterval(async () => {
    const watcher = async () => {
      for (const tfId of watchIds) {
        try {
          const response = await axios.get(TESTFLIGHT_URL + tfId, {
            headers: { 'Accept-Language': 'en-us' }
          });

  
          if (!response.data)
          {
            console.log(response.status, ` - ${tfId} - Not Found.`)
            continue;
          }

          const $ = cheerio.load(response.data);
          const statusText = $(XPATH_STATUS).text().trim();
          const fullSlot = statusText === FULL_TEXT;
          const notOpen = statusText === NOT_OPEN_TEXT;

          // case: not open
          if (notOpen) {
            console.log(response.status, ` - ${tfId} - ${statusText}`)
            continue;
          }

          const title = $('title').text();
          const titleMatch = title.match(TITLE_REGEX);
          // case: slot full
          if(fullSlot){
            console.log(response.status, ` - ${tfId} - ${titleMatch[1]} - ${statusText}`)
            continue;
          }
          // case: slot available
          const tfLink = `${TESTFLIGHT_URL + tfId}`
          await sendNotification(tfLink);
          console.log(response.status, ` - ${tfId} - ${titleMatch[1]} - ${statusText}`)
        } catch (error) {
          console.log(error.response.status, ` - ${tfId} - Invalid ID`)
          //console.error("watch function: ", error);
        }
      }
    }
    watcher();
  }, sleepTime);
}


watch(ID_LIST, sendNotification, SLEEP_TIME);