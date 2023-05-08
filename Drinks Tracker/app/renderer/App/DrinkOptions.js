import React from "react";
import Model from "./Model.js";
import God from "./God.js";
import RollEntry from "./RollEntry.js";
import Searchbar from "./Searchbar.js";


class DrinkOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      table:null,
      chosen:null,
    };
    God.DrinkOptions = this;
    this.SetTable = this.SetTable.bind(this);
  } 

  DrinkList(){
    let tables = [];
    let bad = [];
    // tables.push(<h3 key="top">List of Tables</h3>);

    let drinks = [[]];
    for(let thr of God.Thresholds)
      drinks.push([]);
    for(let t of Model.DrinkNames){
      let drink = Model.DrinkDict[t];
      let match = drink.Match;
      if(Model.MandIngs.length > 0){
        match = Model.MandFilter(drink);
      }
      let n = 0;
      for(let thr of God.Thresholds){
        if(match >= thr) break;
        n++;
      }
      drinks[n].push(t);
    }


    for(let dr in drinks){
      for(let t of drinks[dr]){
        let rec = Model.DrinkDict[t];
        let rating = " ("+Math.floor(rec.Rating)+"/"+5+")";
        if(rec.Rating == 0) rating = "(???)";
        // else if (rec.Rating <= 1) rating = "💀";
        // else{
        //   for(let n = 1;n <= rec.Rating;n++) rating += "⭐";
        // }
        // while(rating.length < 5) rating += "*";
        let cl = "TableListEntry " + God.ThreshColor[dr];
        if(God.PassFilter(rec))
          tables.push(<div key={"T"+tables.length} className={cl} onClick={e=>{this.SetTable(t)}}> {t} {rating}</div>);
        else
          bad.push(<div key={"TB"+bad.length} className={cl} onClick={e=>{this.SetTable(t)}}> {t} {rating}</div>);
      }
      tables.push(<br key={"br"+tables.length}/>);
    }
    tables.push(bad);
    return tables;
  }

  SetTable(table){
    this.setState({table:table});
  }

  DrinkDetails(){
    let drink = Model.DrinkDict[this.state.table];
    if(!drink) return "ERROR";
    let recipes=[];
    for(let rec in drink.Recipes){
      recipes.push(rec);
    }
    // let chosenN = drink.Fave && drink.Recipes[drink.Fave] ? drink.Fave : recipes[0];
    // if(this.state.chosen && this.state.chosen.Drink == this.state.table) chosenN = this.state.chosen.Recipe;
    // let chosen = drink.Recipes[chosenN];
    let txts = [];
    for(let rec of recipes){
      if(txts.length > 0) txts.push(<div key={"SPACE"+txts.length}><br/>--- --- ---<br/><br/><br/></div>)
      txts.push(<div key={"DRINK"+rec}>{this.DrinkText(drink.Recipes[rec],rec)}</div>)
    }
    

    return (<div>
      <h3>{this.state.table}</h3>
      {txts}
      <div className="BackButton" onClick={e=>{this.setState({table:null})}}>Back</div>
    </div>);
  }

  DrinkText(chosen,chosenN){
    let ing = [];
    for(let i of chosen.Ingredients){
      let subValue = God.FindSubValue(i.Type);
      let notes = null;
      if(subValue.Type != i.Type) notes = <i>({i.Type})</i>
      ing.push(<div key={"I"+ing.length+i.Type+i.Amount}>{subValue.Type}: {i.Amount} {notes}</div>);
    }

    return <div>Match: {chosen.Match * 100}%<br/>
    Shop Status: {chosen.ShopStatus}<br/><br/>
    <u><b>Ingredients</b></u>
    {ing}<br/><i>
    Glass: {God.NaCheck(chosen.Glass)}<br/>
    Ice: {God.NaCheck(chosen.Ice)}<br/>
    Garnish: {God.NaCheck(chosen.Garnish)}<br/>
    Rating: {chosen.Rating ? chosen.Rating : "Untried"}<br/>
    From: {chosenN} ({chosen.Page})<br/>
    </i><br/></div>;
  }
  
  render() {
    let content = null;
    if(!this.state.table) content = this.DrinkList();
    else content = this.DrinkDetails();
    
    return (<div><h1><u>Drinks</u></h1>
    <Searchbar/>
    <br/>
    {content}
    </div>);
  }
}





export default DrinkOptions;