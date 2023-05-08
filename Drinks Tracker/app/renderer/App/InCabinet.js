import React from "react";
import Model from "./Model.js";
import God from "./God.js";
import RollResult from "./RollResult.js";

class InCabinet extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      results:[],
    };
    God.Cabinet = this;
  } 

  AddResult(result){
    let res = this.state.results;
    result.Key = Math.random();
    res.push(result);
    this.setState({results:res});
  }

  IngredientList(){
    let tables = [];
    // tables.push(<h3 key="top">List of Tables</h3>);
    // console.log(Model.IList)
    for(let t in Model.IList){
      let cl = "TableListEntry";
      if(Model.MandIngs.indexOf(Model.IList[t]) != -1) cl += " MandIng";
      tables.push(<div key={"T"+tables.length} className={cl} onClick={e=>{Model.ToggleMandIng(Model.IList[t])}}>{Model.IList[t]}</div>);
    }
    return tables;
  }
  
  render() {
    let content = null;
    // if(!this.state.table) 
    content = this.IngredientList();
    // else content = this.TableDetails();
    
    return (<div><h1><u>In My Cabinet...</u></h1>
    {/* <Searchbar/> */}
    <br/>
    {content}
    </div>);
  }
}




export default InCabinet;