import React from "react";
import Model from "./Model.js";
import God from "./God.js";

import { shell } from 'electron';

class RollResult extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
  } 
  
  render() {
    let cl = this.props.first ? "Result First" : "Result";
    let res = this.props.result;
    let readouts = [];
    for(let read of res.Readout){
      let roll = read.Roll ? read.Roll + ": " : "";
      let rcl = "ResultReadout";
      if(read.Class) rcl += " " + read.Class;
      let depth = Math.min(read.Depth,4);
      rcl += " Depth"+depth;
      let rout = <div key={"Read"+readouts.length} className={rcl}>{roll}{read.Text}</div>;
      if(read.Url) rout = <div key={"rurl"+readouts.length} className="Link" onClick={e=>{shell.openExternal(read.Url)}}>{rout}</div>
        // rout = <a key={"rurl"+readouts.length} href={read.Url} target="_blank" rel="noreferrer noopener">{rout}</a>;
      readouts.push(rout);
    }

    return (<div className={cl}>{res.Table}
      {readouts}
    </div>);
  }
}





export default RollResult;