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
  MandIngs:[],
  MissingIngs:{},
  MissingList:[],
  Init: ()=>{
    //Import drink data
    Model.ReadSettings(require(Model.Path+"\\Settings.json"));
    Model.ReadDrinks(require(Model.Path+"\\Recipes.json"));
    // Model.DrinkDict = require(Model.Path+"\\Recipes.json");
    Model.IList = require(Model.Path+"\\Ingredients.json");
    Model.SubDict = require(Model.Path+"\\Subs.json");
    let msg = "";
    for(let dr in Model.DrinkDict){
      Model.DrinkNames.push(dr);
      Model.DrinkInfo[dr] = {};
      Model.DrinkDict[dr].Name = dr;
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
    let list = [];
    for(let dr in Model.IList){
      if(!Model.IList[dr]) continue;
      list.push(dr);
    }
    Model.IList = list;
    for(let dr of Model.IList){
      Model.IDict[dr] = 1.1;
      // itxt[dr] = true;
      if(!Model.SubDict[dr]) {
        msg += "\""+dr + "\":{},\n";
      }
      else{
        for(let sub in Model.SubDict[dr])
          Model.IDict[sub] = Math.max(Model.IDict[sub] ? Model.IDict[sub] : 0,Model.SubDict[dr][sub]);
      }
    }
    // console.log(JSON.stringify(itxt,undefined," "));

    for(let rec in Model.DrinkDict){
      let bMatch = 0;
      let best = null;
      let bRating = 0;
      for(let book in Model.DrinkDict[rec].Recipes){
        let match = 1.1;
        let shopStatus = 0;
        // console.log(rec + " / " + book);
        for(let i in Model.DrinkDict[rec].Recipes[book].Ingredients){
          let type = Model.DrinkDict[rec].Recipes[book].Ingredients[i].Type;
          let subValue = God.FindSubValue(type);
          // console.log(God.FindSubValue(ing.Type).Match);
          match = Math.min(match,subValue.Match);
          shopStatus = Math.max(shopStatus,subValue.ShopStatus);
          // console.log("SUBV: " + type + " / " + subValue.Match)
          if(subValue.Match < God.MandThresh){
            
            let v = (Model.MissingIngs[type] ? Model.MissingIngs[type] : 0) + 1;
            // console.log("MISSING: " + type + " / " + v)
            // console.log(Model.SubDict[type])
            Model.MissingIngs[type] = v;
            for(let sub in Model.SubDict[type]){
              if(Model.SubDict[type][sub] < God.MandThresh) continue;
              let v = (Model.MissingIngs[sub] ? Model.MissingIngs[sub] : 0) + 1;
              Model.MissingIngs[sub] = v;
              // console.log("SUB: " + sub + " / " + v);
            }
          }
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
    // console.log(Model.MissingIngs);
    for(let i in Model.MissingIngs){
      let ok = true;
      for(let sub in Model.SubDict[i]){
        // console.log("I: " + i + " / " + Model.SubDict[i][sub] + " / " + Model.MissingIngs[sub])
        if(Model.SubDict[i][sub] >= God.MandThresh && Model.MissingIngs[sub] != null) {
          ok = false;
          break;
        }
      }
      if(ok)
        Model.MissingList.push(i);
    }
    // console.log(Model.MissingList);
    Model.MissingList.sort((a,b)=> Model.MissingIngs[a] < Model.MissingIngs[b] ? 1 : -1);
    //   console.log(safety)
    // console.log(Model.SubDict);
    // console.log(Model.IDict);
    Model.DrinkNames = God.Shuffle(Model.DrinkNames);
    if(msg != "") console.log(msg);
    God.Searchbar.Setup();
    // console.log(tables);
  },
  ReadSettings(json){
    console.log(json);
    for(let s in json)
      God[s] = json[s];
  },
  ReadDrinks(json){
    Model.DrinkDict = {};
    for(let d in json){
      let ok = true;
      for(let rec in json[d].Recipes){
        if(God.OnlyNew && json[d].Recipes[rec].Rating){
          ok = false;
          break;
        }
      }
      if(!ok) continue;
      Model.DrinkDict[d] = json[d];
    }
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
    
  },
  ToggleMandIng(ing){
    let ind = Model.MandIngs.indexOf(ing);
    if(ind == -1) {
      Model.MandIngs.push(ing);
    }
    else{
      Model.MandIngs.splice(ind,1);
    }
    // console.log("TOGGLE ING: " + ing + " / " + ind);
    Model.MainScreen.Refresh();
  },
  MandFilter(drink){
    let r = drink.Match;
    let needs = [];
    for(let need of Model.MandIngs)
      needs.push(need);
    let ok = false;
    
    
    for(let rec in drink.Recipes){
      
      for(let need of needs){
        ok = false;
        let ns = {};
        ns[need] = 1;
        for(let n in Model.SubDict[need])
          ns[n] = Model.SubDict[need][n];
        
        // if(drink.Name == "Rattlesnake") console.log(">>"+need);
        // if(drink.Name == "Rattlesnake") console.log(ns);
        for(let i of drink.Recipes[rec].Ingredients){
          let ing = Model.SubDict[i.Type];
          // if(drink.Name == "Rattlesnake") console.log("--"+i.Type+"--");
          // if(drink.Name == "Rattlesnake") console.log(ing);
          if(ing == null) continue;
          for(let sub in ns){
            if( ns[sub] < God.MandThresh) continue;
            
            if(i.Type == sub || i.Type == need || (ing[sub] != null && ing[sub] >= God.MandThresh)){
              ok = true;
              break;
            }
          }
          if(ok) break;
        }
        if(!ok) break;
        
      }
      if(ok) break;
      
    }
    if(!ok)
      return r / 2;
    return Math.max(r,0.795);
  }
}

export default Model;