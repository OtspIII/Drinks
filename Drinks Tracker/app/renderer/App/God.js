// import DOMPurify from 'dompurify';
import Model from './Model.js';
// import RollTable from './RollTable.js';
const {Menu, MenuItem } = require('electron').remote
const remote = require ("electron").remote;

var God = {
  Alphabet:"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  // CleanHTML(txt){
  //   if (!txt)
  //     return "";
  //   let r = DOMPurify.sanitize(txt);
  //   r = r
  //   .replace(/&nbsp;/g, '')
  //   .replace(/&amp;/g, '&')
  //   .replace(/&gt;/g, '>')
  //   .replace(/&lt;/g, '<'); 
  //   return r;
  // },
  Clone(obj){
    return JSON.parse(JSON.stringify(obj));
  },
  Merge(original,add){
    if (!original)
      return add;
    if (add){
      for(let pr in add)
        original[pr] = add[pr];
    }
    return original;
  },
  Roll(desc){
    if (Number.isInteger(desc))
      return desc;
    
    let sub = "";
    let stage = 0;
    let rolls = 0;
    let size = 0;
    let bonus = 0;
    for (let n = 0; n < desc.length; n++) {
      let c = desc.substring(n,n+1);
      // console.log("A: ." + c + ". / " + sub + " / " + desc + " / " + n + " / " + stage);
      if (c == "d") {
        stage = 1;
        rolls = sub == "" ? 0 : parseInt(sub);
        if (rolls == 0)
          rolls = 1;
        sub = "";
      } else if (c == "+" || c == "-") {
        stage = 2;
        size = sub == "" ? 0 : parseInt(sub);
        sub = c == "-" ? "-" : "";
      } else
        sub += c;
    }
    // console.log("B: " + sub + " / " + stage + " / " + desc);
    if (stage == 2 || stage == 0)
      bonus = sub == "" ? 0 : parseInt(sub);
    else
      size = sub == "" ? 0 : parseInt(sub);
    //console.log("ROLL: " + desc + " :: " + rolls + " / " + size + " / " + bonus);
    return God.RollRaw(rolls,size,bonus);
  },
  RollRaw(rolls,size,bonus){
    let r = bonus;
    for (let n = 0;n < rolls;n++)
      r += Math.ceil(Math.random() * size);
    // console.log("RES: [" + r + "] " + desc + " :: " + rolls + " / " + size + " / " + bonus);
    return r;
  },
  GetName(thing){
    return JSON.stringify(thing);
  },
  NaCheck(txt){
    if(txt && txt != "") return txt;
    return "N/a";
  }
}

export default God;


