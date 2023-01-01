import React from "react";
import Model from "./Model.js";
import God from "./God.js";

class RollEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
  } 
  
  render() {
    let ent = this.props.entry;
    let w = this.props.w;
    let low = w + 1;
    w += parseInt(ent.Weight);
    let range = ""+w;
    if(w > low) range = low + "-" + range;
    

    return <div>{range}: {ent.Text}</div>;
  }
}





export default RollEntry;