import React from "react";
// import DB from "./DB.js";
import Model from "./Model.js";
import God from "./God.js";
import Text from "./Text.js";
import Things from "./Things.js";
import Button from "./Button.js";

class ThingHolder extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hover:false,
      active:false,
      extra:false,
    }
    this.MouseEnter = this.MouseEnter.bind(this);
    this.MouseLeave = this.MouseLeave.bind(this);
    this.OnClick = this.OnClick.bind(this);
    // this.OnRClick = this.OnRClick.bind(this);
    this.GetState = this.GetState.bind(this);
    // this.SetState = this.SetState.bind(this);
  }

  componentDidMount() {
    this.Elem.addEventListener("contextmenu", e=>{
      // console.log(this.props.thing + " / " + this.props.type + " / " + this.props.prop + " / " + this.props.n)
      if(Things[this.props.type] && Things[this.props.type].RightClick && !this.state.extra){
        God.RClick(this.props.thing,"ThingHolder",{Type:this.props.type,Prop:this.props.prop,N:this.props.n},
          [God.RCOption("Edit",e=>{this.setState({active:!this.state.active,extra:true});})]);
      }
      else{
        this.setState({active:!this.state.active});
        e.preventDefault();
      }
    });
    
    //type, prop, n
  }

  MouseEnter(){
    this.setState({hover:true});
  }

  MouseLeave(){
    this.setState({hover:false});
  }

  OnClick(e){
    // console.log("CLICK: " + e.which);
    // if (e.which == 3)
    //   this.setState({active:!this.state.active});
    // else
      this.setState({extra:!this.state.extra});
  }

  GetState(prop){
    let r =this.state[prop];
    if (r == undefined)
      r = this.props[prop]; 
    return r;
  }

  // OnRClick(e){
  //   // console.log("DCLICK")
  //   if(this.state.extra){
  //     this.setState({active:!this.state.active});
  //     e.preventDefault();
  //   } 
  // }

  // SetState(prop,val){
  //   console.log("SET STATE: " + prop + " / " + val)
  //   this.setState({prop:val});
  // }

  render(){
    let r = <span/>;
    let thing = this.props.thing;
    let f = thing[this.props.prop][this.props.n];
    if (f === undefined){
      console.log("NO F: " + this.props.prop + " / " + this.props.n + " / " + JSON.stringify(thing));
      return <span>beep</span>;
    }
      
    if (typeof f == 'string'){
      r = <Text type={[this.props.prop,this.props.n]} thing={thing} class={this.props.class}/>;
    }
    else{
      if (!f.Subject)
        f.Subject = this.props.type;
      if (Things[f.Subject].Describe)
        r = Things[f.Subject].Describe(thing,this.props.n,this);//.state.active,this.state.hover,this.state.extra,this.SetState);
      else{
        console.log("NO Describe FOR " + f.Subject);
        r = <span>uhoh</span>
      }
    }
    let button= null;//this.state.hover && !this.props.terse ? <Button act='delete' thing={thing} type={this.props.type} type={this.props.prop} click={Model.MainScreen.UpdateFocus} class='ThingHolder'/> : <span/>;
    // console.log("BREAKS: " + this.props.breaks);
    if (!this.props.breaks)
      return <span ref={elem => this.Elem = elem} className='ThingHolder'  onClick={this.OnClick} onMouseEnter={this.MouseEnter} onMouseLeave={this.MouseLeave}>{r}{button}</span>
    return <div ref={elem => this.Elem = elem} className='ThingHolder THDiv'  onClick={this.OnClick} onMouseEnter={this.MouseEnter} onMouseLeave={this.MouseLeave}>{r}{button}</div>
  }

}

export default ThingHolder;

