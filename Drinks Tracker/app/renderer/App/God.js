// import DOMPurify from 'dompurify';
import Model from './Model.js';
// import RollTable from './RollTable.js';
const {Menu, MenuItem } = require('electron').remote
const remote = require ("electron").remote;

var God = {
  RatingThresh:4,
  Thresholds:[0.9,0.8,0.79,0.6],
  ThreshColor:["Perfect","Good","UsesMand","Okay","Bad"],
  MandThresh:0.8,
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
  },
  FindSubValue(ing){
    let ingObj = Model.SubDict[ing];
    let allSubs = [];
    // console.log(ing);
    // console.log(ingObj);
    allSubs.push(ing);
    for(let s in ingObj)
      allSubs.push(s);
    allSubs.sort((a,b)=>{return ingObj[a] >= ingObj[b] ? -1 : 1});
    let shopStatus = 0;
    
    // console.log(allSubs);
    for(let s of allSubs){
      if (Model.IDict[s]){
        if(Model.IDict[s] < 0.9){
          if(Model.SubDict[ing].Staple) shopStatus = 1;
          else if(Model.SubDict[ing].Grocery) shopStatus = 2;
          else shopStatus = 3;
        }
        return {Type:s,Match:Model.IDict[s],ShopStatus:shopStatus};
      }
    }
    if(Model.IDict[ing] < 0.9){
      if(Model.SubDict[ing].Staple) shopStatus = 1;
      else if(Model.SubDict[ing].Grocery) shopStatus = 2;
      else shopStatus = 3;
    }
    return {Type:"Missing",Match:0,ShopStatus:shopStatus};
  },
  Shuffle(list){
    let r = [];
    let safety = 999;
    while(list.length > 0 && safety > 0){
      safety--;
      let n = Math.floor(Math.random() * list.length);
      let chosen = list.splice(n,1);
      r.push(chosen[0]);
    }
    // console.log(r);
    return r;
  },
  PassFilter(drink){
    let ok = false;
    for(let rec in drink.Recipes){
      let rating = drink.Recipes[rec].Rating;
      if(rating == 0 || rating >= God.RatingThresh){
        ok = true;
        break;
      }
    }
    //console.log("PF: " + drink.Name + " / " + drink.Recipes + " / " + ok);
    if(!ok) return false;
    return true;
  }
}

export default God;


