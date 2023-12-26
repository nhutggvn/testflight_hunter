import axios from 'axios';
import * as cheerio from 'cheerio';
import { config } from 'dotenv';
config();
import botCustom from './botCustom.js';
import fs from 'fs';
import { promisify } from 'util';
import constant from './constant.js';
const readFile = promisify(fs.readFile);
const XPATH_STATUS = '.beta-status span';
const TEST_FLIGHT_URL = 'https://testflight.apple.com/join/';
const FULL_TEXT = 'This beta is full.';
const NOT_OPEN_TEXT = "This beta isn't accepting any new testers right now.";
const TITLE_REGEX = /To join the (.*), open the link on your iPhone, iPad, or Mac after you install TestFlight./;
import state from './state.js';
import telegramCommand from './telegramCommand.js';

function watch(sendNotification, INTERVAL_CHECK = 10000) {

  // watchIdSent is used to keep track of the watchIds that have been sent to the bot
  const watchIdSent = [];

  setTimeout(() => {
    watchIdSent.length = 0;
    console.log('watchIdSent list has been reset.');
  }, 24 * 60 * 60 * 1000); // Reset the list in 1 day (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  
  async function getTfList() {
    if (state.isReadingFile) {
      return;
    }
    state.isReadingFile= true;
    const data = await readFile('./tf_list.json');
    state.isReadingFile = false;
    return JSON.parse(data).ID_LIST;
  }
  
  // start the watcher
  setInterval(async () => {
    const tfList = await getTfList();

    if(state.isReadingFile === false) {
    const watcher = async () => {
      for (const tfId of tfList) {
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
            await sendNotification(tfLink,constant.CHAT_ID,constant.TOPIC_ID);
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
  }
  }, INTERVAL_CHECK);
}


watch(botCustom.sendTopic, constant.INTERVAL_CHECK);