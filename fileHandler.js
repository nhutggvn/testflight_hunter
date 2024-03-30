import state from './state.js';
import { readFile, writeFile } from 'fs/promises';
import utils from './utils.js';
import constant from './constant.js';
import axios from 'axios';
// add new data to tf_list.json
const addTfId = async (tfId,sendMessage) => {
    if(state.isReadingFile) {
        return;
    }
    state.isReadingFile = true;
    const data = await readFile('./data/tf_list.json');
    
    const tfList = JSON.parse(data).ID_LIST;
    // check if tfId already exist
    if (tfList.includes(tfId)) {
        console.log('tfId already exist!!!');
        sendMessage('tfId already exist!!!')
        return;
    }
    tfList.push(tfId);
    const newData = JSON.stringify({ ID_LIST: tfList });
    await writeFile('./data/tf_list.json', newData);
    console.log('tfId added!!!');
    sendMessage('tfId added!!!')
    state.isReadingFile = false;
}

// remove data from tf_list.json
const removeTfId = async (tfId,sendMessage) => {
    if(state.isReadingFile) {
        return;
    }
    state.isReadingFile = true;
    const data = await readFile('./data/tf_list.json');
    const tfList = JSON.parse(data).ID_LIST;
    const index = tfList.indexOf(tfId);
    // remove tfId if exist
    if (index > -1) {
        tfList.splice(index, 1);
        sendMessage('tfId removed!!!')
        console.log('tfId removed!!!');
    } else {
        sendMessage('tfId not found!!!')
        console.log('tfId not found!!!');
    }
    const newData = JSON.stringify({ ID_LIST: tfList });
    await writeFile('./data/tf_list.json', newData);
    state.isReadingFile = false;
}

// list all tfId from tf_list.json
const listTfId = async (sendMessage) => {
    if(state.isReadingFile) {
        return;
    }
    state.isReadingFile = true;
    const data = await readFile('./data/tf_list.json');
    state.isReadingFile = false;
    const tfList = JSON.parse(data).ID_LIST;
    let message = 'List of tfId:\n';

    
    const watcher = async () => {
   
        for (const tfId of tfList) {
            const tfLink = `${constant.TEST_FLIGHT_URL + tfId}`
          try {
            const response = await axios.get(tfLink, {
              headers: { 'Accept-Language': 'en-us' }
            });
            const {isAvailableSlot,isFullSlot,isNotOpen} = utils.getStatus(response.data);

            // case 1: Open for testing, slot available
            if(isAvailableSlot)
            {
                message += `<a href="${tfLink}">${tfId}</a> - Slot available\n`;
                console.log(response.status,` - ${tfId} - Slot available`)
                continue;
            }
            
            // case 2: Open for testing, slot full
            if (isFullSlot) {
                message += `<a href="${tfLink}">${tfId}</a> - Full slot\n`
                console.log(response.status,` - ${tfId} - Full slot`)
                continue;
            }
  
            // case 3: Not open for testing
            if (isNotOpen) {
                message += `<a href="${tfLink}">${tfId}</a> - Not open for testing\n`
                console.log(response.status,` - ${tfId} - Not open for testing`)
                continue;
            }
          } catch (error) {
            // case 4: Invalid ID or Removed
            message += `<a href="${tfLink}">${tfId}</a> - Invalid ID or Removed\n`
            console.log(error.response.status, ` - ${tfId} - Invalid ID or Removed`)
          }
        }
      }
    await watcher();

    sendMessage(message);
    console.log(message);

}

const fileHandler = {
    addTfId,
    removeTfId,
    listTfId
}
export default fileHandler;