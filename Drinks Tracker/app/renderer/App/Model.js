import God from "./God.js";
import React from 'react';
import fs from 'fs';
import { table } from "console";

var Model = {
  Path: `${__dirname}\\modules\\`.replace('renderer\\App', 'renderer').replace('\\app.asar', ''),
  DrinkNames:[],
  DrinkInfo:{},
  INames:[],
  IDict:{},
  Init: ()=>{
    //Import drink data
    Model.DrinkDict = require(Model.Path+"\\Recipes.json");
    Model.IList = require(Model.Path+"\\Ingredients.json");
    Model.SubDict = require(Model.Path+"\\Subs.json");
    let msg = "";
    for(let dr in Model.DrinkDict){
      Model.DrinkNames.push(dr);
      Model.DrinkInfo[dr] = {};
      for(let recipe in Model.DrinkDict[dr].Recipes){
        let rec = Model.DrinkDict[dr].Recipes[recipe];
        for(let ing of rec.Ingredients){
          if(!Model.SubDict[ing.Type]) msg += "\""+ing.Type + "\":{},\n";
        }
      }
    }
    //Find the full sub charts for each ingredient
    let allSubs = [];
    for(let sub in Model.SubDict){
      allSubs.push(sub);
    }
    let safety = 99999;
    while(allSubs.length > 0 && safety > 0){
      safety--;
      let current = allSubs[0];
      let done = false;
      while(!done && safety > 0){
        safety--;
        let better = null;
        for(let s in Model.SubDict[current]){
          if(allSubs.indexOf(s) >= 0){
            better = s;
            break;
          }
        }
        if(better){
          current = better;
        }
        else{
          done = true;
        }
      }
      // console.log(current);
      allSubs.splice(allSubs.indexOf(current),1);
      let curr = Model.SubDict[current];
      for(let s in curr){
        if(Model.SubDict[s]){
          for(let subS in Model.SubDict[s]){
            // console.log("X");
            curr[subS] = curr[s] * Model.SubDict[s][subS];
          }
        }
      }
    }
    for(let dr of Model.IList){
      Model.IDict[dr] = 1.1;
      if(!Model.SubDict[dr]) {
        msg += "\""+dr + "\":{},\n";
      }
      else{
        for(let sub in Model.SubDict[dr])
          Model.IDict[sub] = Math.max(Model.IDict[sub] ? Model.IDict[sub] : 0,Model.SubDict[dr][sub]);
      }
    }

    for(let rec in Model.DrinkDict){
      let bMatch = 0;
      let best = null;
      let bRating = 0;
      for(let book in Model.DrinkDict[rec].Recipes){
        let match = 1.1;
        let shopStatus = 0;
        // console.log(rec + " / " + book);
        for(let i in Model.DrinkDict[rec].Recipes[book].Ingredients){
          let subValue = God.FindSubValue(Model.DrinkDict[rec].Recipes[book].Ingredients[i].Type);
          // console.log(God.FindSubValue(ing.Type).Match);
          match = Math.min(match,subValue.Match);
          shopStatus = Math.max(shopStatus,subValue.ShopStatus);
        }
        // console.log()
        Model.DrinkDict[rec].Recipes[book].Match = match;
        Model.DrinkDict[rec].Recipes[book].ShopStatus = shopStatus;
        if(match > bMatch) {
          bMatch = match;
          best = book;
        }
        bRating = Math.max(bRating,Model.DrinkDict[rec].Recipes[book].Rating);
      }
      // console.log(best + " / " + );
      if(best){
        Model.DrinkDict[rec].Match = Model.DrinkDict[rec].Recipes[best].Match;
        Model.DrinkDict[rec].ShopStatus = Model.DrinkDict[rec].Recipes[best].ShopStatus;
      }
      Model.DrinkDict[rec].Rating = bRating;

    }
    //   console.log(safety)
    // console.log(Model.SubDict);
    // console.log(Model.IDict);
    Model.DrinkNames = God.Shuffle(Model.DrinkNames);
    if(msg != "") console.log(msg);
    God.Searchbar.Setup();
    // console.log(tables);
  },
  SplitLine(line){
    let r = [];
    let inQuotes = false;
    let json = false;
    let substr = "";
    for(let n = 0;n < line.length;n++){
      if(line[n] == "{") {
        substr += line[n];
        json = true;
      }
      else if(line[n] == "}") {
        substr += line[n];
        json = false;
      }
      else if(line[n] == "\"" && !json) {
        if(inQuotes){
          inQuotes = false;
        }
        else
          inQuotes = true;
        console.log(n + " / " + line);
      }
      else if(line[n] == ";" && !inQuotes && !json){
        r.push(substr);
        substr = "";
      }
      else
        substr += line[n];
    }
    r.push(substr);
    return r;
  },
  RollOnTable(table){
    if(!table || !table.Entries || table.Entries.length == 0) return;
    let result = {Table:table.Name,Readout:[], ID:Math.random()};
    let picked = Model.PickRandom(table);
    let depth = 0;
    Model.HandleEntry(picked,result,table,depth);
    God.Results.AddResult(result);
  },
  GetWeight(entry){
    let w = parseInt(entry.Weight) ? parseInt(entry.Weight) : 1;
    return w;
  },
  PickRandom(table){
    let totalW = 0;
    for(let ent of table.Entries) totalW += Model.GetWeight(ent);
    let roll = Math.random() * totalW;
    let rollTxt = Math.ceil(roll);
    for(let ent of table.Entries){
      roll -= Model.GetWeight(ent);
      if(roll <= 0) return {Entry:ent,Roll:rollTxt};
    }
    console.log("FAILED TO PICK FROM TABLE: " + table.Name);
  },
  HandleEntry(picked,result,table,depth){
    depth++;
    if(depth > 99) return;
    let ent = picked.Entry;
    let readout = {Text:ent.Text,Roll:picked.Roll,Depth:depth};
    result.Readout.push(readout);
    let info = ent.Info;
    if(info){
      if(info.RollOn){
        for(let tab of info.RollOn){
          let nextTable = Model.Get(tab);
          if(!nextTable) nextTable = table;
          // let rolls = info.RollOn.Amount ? info.RollOn.Amount : 1;
          // for(let n = 0;n < rolls;n++){
          let nPicked = Model.PickRandom(nextTable);
          Model.HandleEntry(nPicked,result,nextTable,depth);
          // } 
        }
      }
      if(info.Url){
        readout.Url = info.Url;
      }
      // console.log("INFO: " + ent.Info);
      // result.Readout.push({Text:JSON.stringify(ent.Info)});
    }
    
  }
}

export default Model;