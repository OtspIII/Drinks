import React from "react";
import Model from "./Model.js";
import God from "./God.js";
import InCabinet from "./InCabinet.js";
import DrinkOptions from "./DrinkOptions.js";

class MainScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: true,
    };
    this.GoBack = this.GoBack.bind(this);
    this.GoForward = this.GoForward.bind(this);
    this.GetState = this.GetState.bind(this);
    this.Refresh = this.Refresh.bind(this);
    Model.MainScreen = this;
    
  } 

  Refresh(){
    this.setState({refreshCode:Math.random()});
  }

  
  GoBack(){
    if (God.History.Past.length <= 0)
      return;
    let p = God.History.Past.splice(-1)[0];
    if (God.History.Current){
      God.History.Future.push(God.History.Current);
      if(God.History.Future.length > 10){
        God.History.Future.splice(0,1);
      }
    }
    // console.log("P: " + JSON.stringify(p) + " / " + Model.Get(p.Subject,p.Link))
    this.UpdateFocus(Model.Get(p.Subject,p.Link),true);
  }

  GoForward(){
    if (God.History.Future.length <= 0)
      return;
    let p = God.History.Future.splice(-1)[0];
    if (God.History.Current){
      God.History.Past.push(God.History.Current);
      if(God.History.Past.length > 10){
        God.History.Past.splice(0,1);
      }
    }
    // console.log("P: " + JSON.stringify(p) + " / " + Model.Get(p.Subject,p.Link))
    this.UpdateFocus(Model.Get(p.Subject,p.Link),true);
  }

  GetState(key){
    return this.state[key];
  }


  componentDidUpdate(prevProps, prevState, snapshot){
    
  }

  
  render() {
    if(!this.state.loaded) return <div>...</div>;
    
    return <div className="MainScreen"> <div className="PanelDivider"/>
      <div className="TableDisplay Panel"><InCabinet/></div>
      <div className="ResultDisplay Panel"><DrinkOptions/></div>
    </div>;
  }
}





export default MainScreen;