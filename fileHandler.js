import state from './state.js';
import { readFile, writeFile } from 'fs/promises';
// add new data to tf_list.json
const addTfId = async (tfId,sendMessage) => {
    if(state.isReadingFile) {
        return;
    }
    state.isReadingFile = true;
    const data = await readFile('./tf_list.json');
    
    const tfList = JSON.parse(data).ID_LIST;
    // check if tfId already exist
    if (tfList.includes(tfId)) {
        console.log('tfId already exist!!!');
        sendMessage('tfId already exist!!!')
        return;
    }
    tfList.push(tfId);
    const newData = JSON.stringify({ ID_LIST: tfList });
    await writeFile('./tf_list.json', newData);
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
    const data = await readFile('./tf_list.json');
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
    await writeFile('./tf_list.json', newData);
    state.isReadingFile = false;
}

const fileHandler = {
    addTfId,
    removeTfId
}
export default fileHandler;