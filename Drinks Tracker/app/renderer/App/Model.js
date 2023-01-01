import God from "./God.js";
import React from 'react';
import fs from 'fs';
import { table } from "console";

var Model = {
  Path: `${__dirname}\\modules\\`.replace('renderer\\App', 'renderer').replace('\\app.asar', ''),
  DrinkNames:[],
  DrinkInfo:{},
  INames:[],
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
          if(!Model.SubDict[ing.Type]) msg += ing.Type + "\n";
        }
      }
    }
    for(let dr of Model.IList){
      if(!Model.SubDict[dr]) msg += "\""+dr + "\":{},\n";
    }
    for(let dr in Model.SubDict){
      // Model.INames.push(dr);
    }
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