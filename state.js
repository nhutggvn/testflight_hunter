// state.js
class State {
    constructor() {
      this._isReadingFile = false;
    }
  
    get isReadingFile() {
      return this._isReadingFile;
    }
  
    set isReadingFile(value) {
      this._isReadingFile = value;
    }
  }
  
  export default new State();