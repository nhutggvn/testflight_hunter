import * as cheerio from 'cheerio';
import constant from './constant.js';
const isTfLink = (link) => {
    return link.includes(constant.TEST_FLIGHT_URL);
}

const getTfCode = (link) => {
   return link.replace(constant.TEST_FLIGHT_URL, "");
}

const getStatus = (data) => {
    const $ = cheerio.load(data);
    const statusText = $(constant.XPATH_STATUS).text().trim();
    const isAvailableSlot = statusText.match(constant.TITLE_REGEX);
    const isFullSlot = statusText === constant.FULL_TEXT;
    const isNotOpen = statusText === constant.NOT_OPEN_TEXT;
    return {isAvailableSlot, isFullSlot, isNotOpen};
}

const utils = {
    isTfLink,
    getTfCode,
    getStatus
}
export default utils;