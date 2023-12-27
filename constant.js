import { config } from 'dotenv';
config();

const constant = {
    CHAT_ID: process.env.CHAT_ID,
    BOT_WATCHER_TOKEN: process.env.BOT_WATCHER_TOKEN,
    BOT_URL: `https://api.telegram.org/bot${process.env.BOT_WATCHER_TOKEN}/sendMessage`,
    TOPIC_ID: process.env.TOPIC_ID,
    IS_READING_FILE: false,
    XPATH_STATUS: '.beta-status span',
    TEST_FLIGHT_URL: 'https://testflight.apple.com/join/',
    FULL_TEXT: 'This beta is full.',
    NOT_OPEN_TEXT: "This beta isn't accepting any new testers right now.",
    TITLE_REGEX: /To join the (.*), open the link on your iPhone, iPad, or Mac after you install TestFlight./,
};

export default constant;