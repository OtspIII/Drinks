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
    tables.push(<h3 key="top">List of Tables</h3>);
    for(let t in Model.DrinkDict)
      tables.push(<div key={"T"+tables.length} className="TableListEntry" onClick={e=>{this.SetTable(t)}}>{t}</div>);
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
    let chosenN = drink.Fave && drink.Recipes[drink.Fave] ? drink.Fave : recipes[0];
    if(this.state.chosen && this.state.chosen.Drink == this.state.table) chosenN = this.state.chosen.Recipe;
    let chosen = drink.Recipes[chosenN];
    
    let ing = [];
    for(let i of chosen.Ingredients){
      ing.push(<div key={"I"+ing.length+i.Type+i.Amount}>{i.Type}: {i.Amount}</div>);
    }

    return (<div>
      <h3>{this.state.table}</h3>
      <u><b>Ingredients</b></u>
      {ing}<br/><i>
      Glass: {God.NaCheck(chosen.Glass)}<br/>
      Ice: {God.NaCheck(chosen.Ice)}<br/>
      Garnish: {God.NaCheck(chosen.Garnish)}<br/>
      Rating: {chosen.Rating ? chosen.Rating : "Untried"}<br/>
      From: {chosenN} ({chosen.Page})<br/>
      </i><br/>
      <div className="BackButton" onClick={e=>{this.setState({table:null})}}>Back</div>
    </div>);
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